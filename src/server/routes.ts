import express, { Request, Response } from 'express';
import { db, Appointment, AppointmentStatus, User, BlockedDate, AppointmentType, CollectionItem, GalleryItem, ReviewItem, PromotionItem } from './db.js';

export const router = express.Router();

// Helper to convert time strings (HH:mm) to minutes from midnight
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Generate unique booking number
function generateBookingNumber(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `NME-PUN-${year}-${randomDigits}`;
}

// ==========================================
// STORE & SETTINGS
// ==========================================
router.get('/store', (req: Request, res: Response) => {
  res.json({
    store: db.get('store'),
    settings: db.get('settings'),
  });
});

router.patch('/store', (req: Request, res: Response) => {
  const current = db.get('store');
  const updated = { ...current, ...req.body };
  db.set('store', updated);
  db.logAudit('UPDATE_STORE', req.body.userEmail || 'Admin', 'Updated store information');
  res.json({ success: true, store: updated });
});

router.patch('/settings', (req: Request, res: Response) => {
  const current = db.get('settings');
  const updated = { ...current, ...req.body };
  db.set('settings', updated);
  db.logAudit('UPDATE_SETTINGS', req.body.userEmail || 'Admin', 'Updated booking controls');
  res.json({ success: true, settings: updated });
});

// ==========================================
// BUSINESS HOURS
// ==========================================
router.get('/business-hours', (req: Request, res: Response) => {
  res.json(db.get('businessHours'));
});

router.patch('/business-hours', (req: Request, res: Response) => {
  const { hours } = req.body;
  if (Array.isArray(hours)) {
    db.set('businessHours', hours);
    db.logAudit('UPDATE_BUSINESS_HOURS', req.body.userEmail || 'Admin', 'Updated store operating hours');
    res.json({ success: true, businessHours: hours });
  } else {
    res.status(400).json({ error: 'Invalid business hours data' });
  }
});

// ==========================================
// BLOCKED DATES
// ==========================================
router.get('/blocked-dates', (req: Request, res: Response) => {
  res.json(db.get('blockedDates'));
});

router.post('/blocked-dates', (req: Request, res: Response) => {
  const { date, startTime, endTime, reason, isFullDay } = req.body;
  if (!date || !reason) {
    return res.status(400).json({ error: 'Date and reason are required' });
  }

  const newBlocked: BlockedDate = {
    id: 'blk-' + Date.now(),
    date,
    startTime: isFullDay ? null : startTime,
    endTime: isFullDay ? null : endTime,
    reason,
    isFullDay: Boolean(isFullDay),
    createdAt: new Date().toISOString(),
  };

  db.update(data => {
    data.blockedDates.push(newBlocked);
  });
  db.logAudit('CREATE_BLOCKED_DATE', req.body.userEmail || 'Admin', `Blocked ${date}: ${reason}`);
  res.status(201).json(newBlocked);
});

router.delete('/blocked-dates/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.update(data => {
    data.blockedDates = data.blockedDates.filter(b => b.id !== id);
  });
  db.logAudit('DELETE_BLOCKED_DATE', 'Admin', `Removed blocked date ${id}`);
  res.json({ success: true });
});

// ==========================================
// APPOINTMENT TYPES
// ==========================================
router.get('/appointment-types', (req: Request, res: Response) => {
  const activeOnly = req.query.active === 'true';
  const all = db.get('appointmentTypes');
  if (activeOnly) {
    return res.json(all.filter(a => a.active));
  }
  res.json(all);
});

router.post('/appointment-types', (req: Request, res: Response) => {
  const { name, description, duration, capacity, active, tag, image } = req.body;
  if (!name || !duration) {
    return res.status(400).json({ error: 'Name and duration are required' });
  }

  const newType: AppointmentType = {
    id: 'apt-' + Date.now(),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    duration: Number(duration) || 45,
    capacity: Number(capacity) || 1,
    active: active !== undefined ? active : true,
    tag: tag || 'Style Service',
    image: image || '/src/assets/images/newme_styling_lounge_1790918325187.jpg',
  };

  db.update(data => {
    data.appointmentTypes.push(newType);
  });
  db.logAudit('CREATE_APPOINTMENT_TYPE', 'Admin', `Added appointment type: ${name}`);
  res.status(201).json(newType);
});

router.patch('/appointment-types/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let updatedItem: AppointmentType | null = null;

  db.update(data => {
    const idx = data.appointmentTypes.findIndex(a => a.id === id);
    if (idx !== -1) {
      data.appointmentTypes[idx] = { ...data.appointmentTypes[idx], ...req.body };
      updatedItem = data.appointmentTypes[idx];
    }
  });

  if (!updatedItem) {
    return res.status(404).json({ error: 'Appointment type not found' });
  }
  db.logAudit('UPDATE_APPOINTMENT_TYPE', 'Admin', `Updated appointment type: ${id}`);
  res.json(updatedItem);
});

router.delete('/appointment-types/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.update(data => {
    data.appointmentTypes = data.appointmentTypes.filter(a => a.id !== id);
  });
  db.logAudit('DELETE_APPOINTMENT_TYPE', 'Admin', `Deleted appointment type: ${id}`);
  res.json({ success: true });
});

// ==========================================
// AVAILABILITY ENGINE
// ==========================================
router.get('/availability', (req: Request, res: Response) => {
  const { date, typeId } = req.query;

  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'Date (YYYY-MM-DD) is required' });
  }

  const appointmentTypes = db.get('appointmentTypes');
  const appointmentType = appointmentTypes.find(t => t.id === typeId) || appointmentTypes[0];

  if (!appointmentType || !appointmentType.active) {
    return res.status(400).json({ error: 'Selected appointment type is not available' });
  }

  // Parse target date and find day of week
  const [year, month, day] = date.split('-').map(Number);
  const targetDateObj = new Date(year, month - 1, day);
  const dayIndex = targetDateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const businessHoursList = db.get('businessHours');
  const daySchedule = businessHoursList.find(bh => bh.dayIndex === dayIndex);

  if (!daySchedule || !daySchedule.isOpen) {
    return res.json({
      date,
      dayOfWeek: daySchedule?.dayOfWeek || 'Unknown',
      isOpen: false,
      reason: 'Store is closed on this day of the week',
      slots: [],
    });
  }

  // Check full-day blocked dates
  const blockedDates = db.get('blockedDates');
  const fullDayBlock = blockedDates.find(b => b.date === date && b.isFullDay);
  if (fullDayBlock) {
    return res.json({
      date,
      dayOfWeek: daySchedule.dayOfWeek,
      isOpen: false,
      reason: `Store closed for ${fullDayBlock.reason}`,
      slots: [],
    });
  }

  // Partial blocked ranges for the day
  const partialBlocks = blockedDates.filter(b => b.date === date && !b.isFullDay && b.startTime && b.endTime);

  const settings = db.get('settings');
  const slotInterval = settings.bookingIntervalMin || 30;
  const duration = appointmentType.duration;
  const maxCapacity = appointmentType.capacity || 1;

  const openMins = timeToMinutes(daySchedule.openTime);
  const closeMins = timeToMinutes(daySchedule.closeTime);

  // Existing active appointments for this date
  const appointments = db.get('appointments');
  const dayAppointments = appointments.filter(
    apt => apt.date === date && apt.status !== 'CANCELLED' && apt.status !== 'NO-SHOW'
  );

  const slots = [];
  const now = new Date();
  const isToday =
    now.getFullYear() === year &&
    now.getMonth() === month - 1 &&
    now.getDate() === day;
  const currentMinsNow = now.getHours() * 60 + now.getMinutes();
  const minNoticeMins = (settings.minNoticeHours || 2) * 60;

  for (let start = openMins; start + duration <= closeMins; start += slotInterval) {
    const end = start + duration;
    const timeStr = minutesToTime(start);
    const endTimeStr = minutesToTime(end);

    // Check notice period if today
    if (isToday && start < currentMinsNow + minNoticeMins) {
      continue;
    }

    // Check if slot falls in a partial blocked range
    let isBlocked = false;
    let blockReason = '';
    for (const pb of partialBlocks) {
      if (pb.startTime && pb.endTime) {
        const bStart = timeToMinutes(pb.startTime);
        const bEnd = timeToMinutes(pb.endTime);
        if (start < bEnd && end > bStart) {
          isBlocked = true;
          blockReason = pb.reason;
          break;
        }
      }
    }

    if (isBlocked) {
      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        available: false,
        remainingCapacity: 0,
        status: 'UNAVAILABLE',
        reason: blockReason || 'Reserved / Maintenance',
      });
      continue;
    }

    // Check overlap with existing appointments of the same type or total store capacity
    const overlapping = dayAppointments.filter(apt => {
      const aptStart = timeToMinutes(apt.startTime);
      const aptEnd = timeToMinutes(apt.endTime);
      return start < aptEnd && end > aptStart;
    });

    const sameTypeOverlapping = overlapping.filter(apt => apt.appointmentTypeId === appointmentType.id);
    const totalSimultaneous = overlapping.length;

    const remainingForType = maxCapacity - sameTypeOverlapping.length;
    const remainingStore = (settings.maxSimultaneousBookings || 3) - totalSimultaneous;
    const effectiveRemaining = Math.max(0, Math.min(remainingForType, remainingStore));

    const isAvailable = effectiveRemaining > 0;
    const slotStatus = !isAvailable
      ? 'UNAVAILABLE'
      : effectiveRemaining === 1
      ? 'LIMITED'
      : 'AVAILABLE';

    slots.push({
      time: timeStr,
      endTime: endTimeStr,
      available: isAvailable,
      remainingCapacity: effectiveRemaining,
      status: slotStatus,
    });
  }

  res.json({
    date,
    dayOfWeek: daySchedule.dayOfWeek,
    isOpen: true,
    openTime: daySchedule.openTime,
    closeTime: daySchedule.closeTime,
    duration,
    slots,
  });
});

// ==========================================
// APPOINTMENTS CRUD & DOUBLE BOOKING PROTECTION
// ==========================================
router.get('/appointments', (req: Request, res: Response) => {
  const { date, status, customerId, search } = req.query;
  let list = db.get('appointments');

  if (date && typeof date === 'string') {
    list = list.filter(a => a.date === date);
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    list = list.filter(a => a.status === status);
  }

  if (customerId && typeof customerId === 'string') {
    list = list.filter(a => a.customerId === customerId);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      a =>
        a.bookingNumber.toLowerCase().includes(q) ||
        a.customerName.toLowerCase().includes(q) ||
        a.customerEmail.toLowerCase().includes(q) ||
        a.customerPhone.toLowerCase().includes(q) ||
        a.appointmentTypeName.toLowerCase().includes(q)
    );
  }

  // Sort descending by date and time
  list.sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`));

  res.json(list);
});

router.get('/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const apt = db.get('appointments').find(a => a.id === id || a.bookingNumber === id);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  res.json(apt);
});

// POST new appointment with strict double booking verification
router.post('/appointments', (req: Request, res: Response) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    appointmentTypeId,
    date,
    startTime,
    guestCount,
    stylePreference,
    occasion,
    preferredSize,
    specialRequest,
    instagramHandle,
    preferredContactMethod,
    customerId,
  } = req.body;

  if (!customerName || !customerPhone || !appointmentTypeId || !date || !startTime) {
    return res.status(400).json({ error: 'Missing required appointment fields' });
  }

  const appointmentTypes = db.get('appointmentTypes');
  const apptType = appointmentTypes.find(t => t.id === appointmentTypeId);
  if (!apptType || !apptType.active) {
    return res.status(400).json({ error: 'Selected appointment type is not available' });
  }

  const startMins = timeToMinutes(startTime);
  const endMins = startMins + apptType.duration;
  const endTime = minutesToTime(endMins);

  // Check store day hours
  const [year, month, day] = date.split('-').map(Number);
  const targetDateObj = new Date(year, month - 1, day);
  const dayIndex = targetDateObj.getDay();
  const businessHoursList = db.get('businessHours');
  const daySchedule = businessHoursList.find(bh => bh.dayIndex === dayIndex);

  if (!daySchedule || !daySchedule.isOpen) {
    return res.status(409).json({ error: 'Store is closed on the selected date' });
  }

  if (startMins < timeToMinutes(daySchedule.openTime) || endMins > timeToMinutes(daySchedule.closeTime)) {
    return res.status(409).json({ error: 'Appointment time falls outside store hours' });
  }

  // Check blocked dates
  const blockedDates = db.get('blockedDates');
  const fullBlock = blockedDates.find(b => b.date === date && b.isFullDay);
  if (fullBlock) {
    return res.status(409).json({ error: `Store is closed: ${fullBlock.reason}` });
  }

  const partialBlock = blockedDates.find(b => {
    if (b.date === date && !b.isFullDay && b.startTime && b.endTime) {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return startMins < bEnd && endMins > bStart;
    }
    return false;
  });

  if (partialBlock) {
    return res.status(409).json({ error: `Time slot is reserved for store event: ${partialBlock.reason}` });
  }

  // ATOMIC OVERLAP CHECK (Double Booking Protection)
  const settings = db.get('settings');
  const existingAppointments = db.get('appointments');
  const activeOverlapping = existingAppointments.filter(apt => {
    if (apt.date !== date || apt.status === 'CANCELLED' || apt.status === 'NO-SHOW') {
      return false;
    }
    const aStart = timeToMinutes(apt.startTime);
    const aEnd = timeToMinutes(apt.endTime);
    return startMins < aEnd && endMins > aStart;
  });

  const sameTypeCount = activeOverlapping.filter(a => a.appointmentTypeId === apptType.id).length;
  if (sameTypeCount >= apptType.capacity) {
    return res.status(409).json({
      error: `Selected time slot for ${apptType.name} is fully booked. Please choose an alternative time slot.`,
    });
  }

  if (activeOverlapping.length >= settings.maxSimultaneousBookings) {
    return res.status(409).json({
      error: 'Store is at maximum guest appointment capacity for this time. Please select another slot.',
    });
  }

  const newAppointment: Appointment = {
    id: 'apt-' + Date.now(),
    bookingNumber: generateBookingNumber(),
    customerId: customerId || undefined,
    customerName,
    customerEmail: customerEmail || '',
    customerPhone,
    appointmentTypeId: apptType.id,
    appointmentTypeName: apptType.name,
    storeId: 'store-pune-phoenix',
    date,
    startTime,
    endTime,
    guestCount: Math.min(Number(guestCount) || 1, settings.maxGuests),
    stylePreference: stylePreference || 'Not specified',
    occasion: occasion || 'General Consultation',
    preferredSize: preferredSize || 'Not specified',
    specialRequest: specialRequest || '',
    instagramHandle: instagramHandle || '',
    preferredContactMethod: preferredContactMethod || 'WHATSAPP',
    status: settings.autoConfirm ? 'CONFIRMED' : 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.update(data => {
    data.appointments.push(newAppointment);

    // If user is logged in or email exists, associate with customer
    if (customerId) {
      const user = data.users.find(u => u.id === customerId);
      if (user && !user.phone) {
        user.phone = customerPhone;
      }
    }
  });

  db.logAudit(
    'CREATE_BOOKING',
    customerName,
    `Booked ${apptType.name} on ${date} at ${startTime} (ID: ${newAppointment.bookingNumber})`
  );

  res.status(201).json(newAppointment);
});

// Update appointment status / reschedule / add staff notes
router.patch('/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, date, startTime, staffNotes, specialRequest } = req.body;

  let updatedApt: Appointment | null = null;

  db.update(data => {
    const apt = data.appointments.find(a => a.id === id || a.bookingNumber === id);
    if (!apt) return;

    if (status) {
      apt.status = status as AppointmentStatus;
    }

    if (staffNotes !== undefined) {
      apt.staffNotes = staffNotes;
    }

    if (specialRequest !== undefined) {
      apt.specialRequest = specialRequest;
    }

    if (date && startTime) {
      apt.date = date;
      apt.startTime = startTime;
      const type = data.appointmentTypes.find(t => t.id === apt.appointmentTypeId);
      const dur = type ? type.duration : 45;
      const startM = timeToMinutes(startTime);
      apt.endTime = minutesToTime(startM + dur);
    }

    apt.updatedAt = new Date().toISOString();
    updatedApt = apt;
  });

  if (!updatedApt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  db.logAudit('UPDATE_BOOKING', 'System', `Updated appointment ${id} status: ${status || 'details'}`);
  res.json(updatedApt);
});

// ==========================================
// COLLECTIONS
// ==========================================
router.get('/collections', (req: Request, res: Response) => {
  const activeOnly = req.query.active === 'true';
  const list = db.get('collections');
  if (activeOnly) {
    return res.json(list.filter(c => c.active).sort((a, b) => a.sortOrder - b.sortOrder));
  }
  res.json(list.sort((a, b) => a.sortOrder - b.sortOrder));
});

router.post('/collections', (req: Request, res: Response) => {
  const { name, description, image, externalUrl, featured, active, itemCountLabel } = req.body;
  const newCol: CollectionItem = {
    id: 'col-' + Date.now(),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    image: image || '/src/assets/images/newme_fashion_collection_1790918312190.jpg',
    externalUrl: externalUrl || 'https://newme.asia/',
    featured: Boolean(featured),
    active: active !== undefined ? Boolean(active) : true,
    sortOrder: db.get('collections').length + 1,
    itemCountLabel: itemCountLabel || '50+ Styles',
  };

  db.update(data => {
    data.collections.push(newCol);
  });
  db.logAudit('CREATE_COLLECTION', 'Admin', `Added collection ${name}`);
  res.status(201).json(newCol);
});

router.patch('/collections/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let updatedCol: CollectionItem | null = null;
  db.update(data => {
    const idx = data.collections.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.collections[idx] = { ...data.collections[idx], ...req.body };
      updatedCol = data.collections[idx];
    }
  });

  if (!updatedCol) return res.status(404).json({ error: 'Collection not found' });
  db.logAudit('UPDATE_COLLECTION', 'Admin', `Updated collection ${id}`);
  res.json(updatedCol);
});

router.delete('/collections/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.update(data => {
    data.collections = data.collections.filter(c => c.id !== id);
  });
  db.logAudit('DELETE_COLLECTION', 'Admin', `Deleted collection ${id}`);
  res.json({ success: true });
});

// ==========================================
// GALLERY
// ==========================================
router.get('/gallery', (req: Request, res: Response) => {
  const { category } = req.query;
  let list = db.get('gallery');
  if (category && typeof category === 'string' && category !== 'ALL') {
    list = list.filter(g => g.category === category);
  }
  res.json(list.sort((a, b) => a.sortOrder - b.sortOrder));
});

router.post('/gallery', (req: Request, res: Response) => {
  const { imageUrl, title, altText, category, featured } = req.body;
  const newItem: GalleryItem = {
    id: 'gal-' + Date.now(),
    imageUrl,
    title: title || 'NEWME Pune',
    altText: altText || 'NEWME Phoenix Marketcity Pune',
    category: category || 'STORE',
    featured: Boolean(featured),
    sortOrder: db.get('gallery').length + 1,
  };

  db.update(data => {
    data.gallery.push(newItem);
  });
  db.logAudit('CREATE_GALLERY_IMAGE', 'Admin', `Added gallery image ${title}`);
  res.status(201).json(newItem);
});

router.patch('/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let item: GalleryItem | null = null;
  db.update(data => {
    const idx = data.gallery.findIndex(g => g.id === id);
    if (idx !== -1) {
      data.gallery[idx] = { ...data.gallery[idx], ...req.body };
      item = data.gallery[idx];
    }
  });
  if (!item) return res.status(404).json({ error: 'Gallery item not found' });
  res.json(item);
});

router.delete('/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.update(data => {
    data.gallery = data.gallery.filter(g => g.id !== id);
  });
  res.json({ success: true });
});

// ==========================================
// REVIEWS
// ==========================================
router.get('/reviews', (req: Request, res: Response) => {
  const approvedOnly = req.query.approved === 'true';
  const list = db.get('reviews');
  if (approvedOnly) {
    return res.json(list.filter(r => r.approved));
  }
  res.json(list);
});

router.post('/reviews', (req: Request, res: Response) => {
  const { customerName, rating, reviewText, visitType } = req.body;
  if (!customerName || !rating || !reviewText) {
    return res.status(400).json({ error: 'Customer name, rating, and review text required' });
  }

  const newReview: ReviewItem = {
    id: 'rev-' + Date.now(),
    customerName,
    rating: Math.min(5, Math.max(1, Number(rating))),
    reviewText,
    reviewDate: new Date().toISOString().split('T')[0],
    verified: true,
    approved: true, // Auto-approve for demo
    featured: false,
    visitType: visitType || 'Store Visit',
  };

  db.update(data => {
    data.reviews.unshift(newReview);
  });
  db.logAudit('CREATE_REVIEW', customerName, `Submitted ${rating}-star review`);
  res.status(201).json(newReview);
});

router.patch('/reviews/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let rev: ReviewItem | null = null;
  db.update(data => {
    const idx = data.reviews.findIndex(r => r.id === id);
    if (idx !== -1) {
      data.reviews[idx] = { ...data.reviews[idx], ...req.body };
      rev = data.reviews[idx];
    }
  });
  if (!rev) return res.status(404).json({ error: 'Review not found' });
  res.json(rev);
});

router.delete('/reviews/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.update(data => {
    data.reviews = data.reviews.filter(r => r.id !== id);
  });
  res.json({ success: true });
});

// ==========================================
// PROMOTIONS
// ==========================================
router.get('/promotions', (req: Request, res: Response) => {
  const activeOnly = req.query.active === 'true';
  const list = db.get('promotions');
  if (activeOnly) {
    return res.json(list.filter(p => p.active));
  }
  res.json(list);
});

router.post('/promotions', (req: Request, res: Response) => {
  const { title, subtitle, image, ctaText, ctaUrl, startDate, endDate, active } = req.body;
  const newPromo: PromotionItem = {
    id: 'promo-' + Date.now(),
    title,
    subtitle: subtitle || '',
    image: image || '/src/assets/images/newme_pune_hero_1790918151414.jpg',
    ctaText: ctaText || 'Explore In-Store',
    ctaUrl: ctaUrl || '/book-visit',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || '2026-12-31',
    active: active !== undefined ? Boolean(active) : true,
  };

  db.update(data => {
    data.promotions.push(newPromo);
  });
  res.status(201).json(newPromo);
});

router.patch('/promotions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let promo: PromotionItem | null = null;
  db.update(data => {
    const idx = data.promotions.findIndex(p => p.id === id);
    if (idx !== -1) {
      data.promotions[idx] = { ...data.promotions[idx], ...req.body };
      promo = data.promotions[idx];
    }
  });
  if (!promo) return res.status(404).json({ error: 'Promotion not found' });
  res.json(promo);
});

router.delete('/promotions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.update(data => {
    data.promotions = data.promotions.filter(p => p.id !== id);
  });
  res.json({ success: true });
});

// ==========================================
// AUTHENTICATION
// ==========================================
router.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const users = db.get('users');
  const user = users.find(u => u.email.toLowerCase() === email?.toLowerCase());

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email address or password' });
  }

  // Return user without password
  const { passwordHash: _, ...safeUser } = user;
  res.json({
    user: safeUser,
    token: 'jwt-session-token-' + user.id,
  });
});

router.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const users = db.get('users');
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: 'usr-' + Date.now(),
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    passwordHash: password,
    role: 'CUSTOMER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.update(data => {
    data.users.push(newUser);
    data.profiles.push({
      id: 'prof-' + Date.now(),
      userId: newUser.id,
      stylePreferences: [],
      occasionPreferences: [],
    });
  });

  db.logAudit('USER_REGISTER', email, `New customer registered: ${name}`);
  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({
    user: safeUser,
    token: 'jwt-session-token-' + newUser.id,
  });
});

router.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.get('users').find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (user) {
    db.logAudit('FORGOT_PASSWORD', email, 'Requested password reset link');
  }
  // Always return success for security
  res.json({ success: true, message: 'Password reset link sent to your registered email' });
});

router.post('/auth/reset-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  let found = false;
  db.update(data => {
    const user = data.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
    if (user) {
      user.passwordHash = newPassword;
      user.updatedAt = new Date().toISOString();
      found = true;
    }
  });

  if (!found) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ success: true, message: 'Password successfully updated' });
});

// ==========================================
// ADMIN DASHBOARD ANALYTICS & CUSTOMERS
// ==========================================
router.get('/admin/dashboard', (req: Request, res: Response) => {
  const appointments = db.get('appointments');
  const appointmentTypes = db.get('appointmentTypes');

  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const upcomingAppointments = appointments.filter(
    a => a.date >= todayStr && a.status !== 'CANCELLED' && a.status !== 'NO-SHOW'
  );
  const pendingRequests = appointments.filter(a => a.status === 'PENDING');
  const completedVisits = appointments.filter(a => a.status === 'COMPLETED');
  const cancelledVisits = appointments.filter(a => a.status === 'CANCELLED');

  // Distribution by appointment type
  const typeDistribution: Record<string, number> = {};
  for (const t of appointmentTypes) {
    typeDistribution[t.name] = appointments.filter(a => a.appointmentTypeId === t.id).length;
  }

  // Peak booking hours
  const hourCounts: Record<string, number> = {};
  for (const a of appointments) {
    const hour = a.startTime.split(':')[0] + ':00';
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  }

  // Bookings by date (last 7 days + next 7 days)
  const bookingsByDate: Record<string, number> = {};
  for (let offset = -7; offset <= 7; offset++) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dStr = d.toISOString().split('T')[0];
    bookingsByDate[dStr] = appointments.filter(a => a.date === dStr).length;
  }

  res.json({
    metrics: {
      totalBookings: appointments.length,
      todayCount: todayAppointments.length,
      upcomingCount: upcomingAppointments.length,
      pendingCount: pendingRequests.length,
      completedCount: completedVisits.length,
      cancelledCount: cancelledVisits.length,
    },
    todaySchedule: todayAppointments.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    typeDistribution,
    hourCounts,
    bookingsByDate,
  });
});

router.get('/admin/customers', (req: Request, res: Response) => {
  const users = db.get('users');
  const appointments = db.get('appointments');
  const profiles = db.get('profiles');

  // Aggregate customer details from users + guests with appointments
  const customerMap = new Map<string, any>();

  // Registered customers
  for (const u of users) {
    if (u.role === 'CUSTOMER') {
      const userApts = appointments.filter(a => a.customerId === u.id || a.customerEmail === u.email);
      const lastApt = userApts.sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`))[0];
      const profile = profiles.find(p => p.userId === u.id);

      customerMap.set(u.email.toLowerCase(), {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        totalBookings: userApts.length,
        lastVisit: lastApt ? `${lastApt.date} ${lastApt.startTime}` : 'None',
        upcomingVisit: userApts.find(a => a.date >= new Date().toISOString().split('T')[0] && a.status !== 'CANCELLED')?.date || 'None',
        status: userApts.some(a => a.status === 'CONFIRMED') ? 'Active' : 'Registered',
        preferences: profile?.stylePreferences || [],
        preferredSize: profile?.preferredSize || 'Not specified',
      });
    }
  }

  // Also include guest bookings that aren't registered yet
  for (const a of appointments) {
    const emailKey = (a.customerEmail || a.customerPhone).toLowerCase();
    if (!customerMap.has(emailKey)) {
      const guestApts = appointments.filter(
        item => (item.customerEmail && item.customerEmail.toLowerCase() === emailKey) || item.customerPhone === a.customerPhone
      );
      customerMap.set(emailKey, {
        id: 'guest-' + Math.abs(emailKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)),
        name: a.customerName,
        email: a.customerEmail || 'N/A',
        phone: a.customerPhone,
        totalBookings: guestApts.length,
        lastVisit: `${a.date} ${a.startTime}`,
        upcomingVisit: guestApts.find(item => item.date >= new Date().toISOString().split('T')[0])?.date || 'None',
        status: 'Guest',
        preferences: [a.stylePreference],
        preferredSize: a.preferredSize,
      });
    }
  }

  res.json(Array.from(customerMap.values()));
});
