import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'CUSTOMER';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  stylePreferences?: string[];
  preferredSize?: string;
  occasionPreferences?: string[];
  notes?: string;
}

export interface StoreInfo {
  id: string;
  name: string;
  tagline: string;
  address: string;
  mall: string;
  floor: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  instagramUrl: string;
  websiteUrl: string;
  storeLocatorUrl: string;
  active: boolean;
}

export interface StoreSettings {
  defaultDurationMin: number;
  bookingIntervalMin: number;
  dailyCapacity: number;
  maxSimultaneousBookings: number;
  minNoticeHours: number;
  maxAdvanceDays: number;
  bufferTimeMin: number;
  maxGuests: number;
  autoConfirm: boolean;
}

export interface BusinessDayHours {
  id: string;
  dayOfWeek: string; // 'Monday', 'Tuesday', ...
  dayIndex: number; // 0 for Sunday or 1 for Monday
  isOpen: boolean;
  openTime: string; // '10:30'
  closeTime: string; // '21:30'
  notes?: string;
}

export interface BlockedDate {
  id: string;
  date: string; // 'YYYY-MM-DD'
  startTime?: string | null; // 'HH:mm'
  endTime?: string | null;
  reason: string;
  isFullDay: boolean;
  createdAt: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: number; // minutes
  capacity: number; // simultaneous bookings allowed
  active: boolean;
  tag: string;
  image?: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED-IN' | 'COMPLETED' | 'CANCELLED' | 'NO-SHOW';

export interface Appointment {
  id: string;
  bookingNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentTypeId: string;
  appointmentTypeName: string;
  storeId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  guestCount: number;
  stylePreference: string;
  occasion: string;
  preferredSize: string;
  specialRequest?: string;
  instagramHandle?: string;
  preferredContactMethod?: 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PHONE';
  status: AppointmentStatus;
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  externalUrl: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  itemCountLabel?: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  altText: string;
  category: 'STORE' | 'FASHION' | 'LOOKS' | 'NEW DROPS' | 'EVENTS';
  featured: boolean;
  sortOrder: number;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number; // 1-5
  reviewText: string;
  reviewDate: string;
  verified: boolean;
  approved: boolean;
  featured: boolean;
  visitType?: string;
}

export interface PromotionItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  store: StoreInfo;
  settings: StoreSettings;
  businessHours: BusinessDayHours[];
  blockedDates: BlockedDate[];
  appointmentTypes: AppointmentType[];
  appointments: Appointment[];
  collections: CollectionItem[];
  gallery: GalleryItem[];
  reviews: ReviewItem[];
  promotions: PromotionItem[];
  users: User[];
  profiles: CustomerProfile[];
  auditLogs: AuditLog[];
}

const DB_PATH = path.resolve(process.cwd(), 'data', 'database.json');

// Initial seed data with verified Pune Phoenix Marketcity details
const initialData: DatabaseSchema = {
  store: {
    id: 'store-pune-phoenix',
    name: 'NEWME — Phoenix Marketcity Pune',
    tagline: 'Fresh fits, trend-led fashion & personal styling in Viman Nagar',
    address: '10, Lower Ground Floor, Phoenix Marketcity, GP 09, Clover Park, Viman Nagar',
    mall: 'Phoenix Marketcity',
    floor: 'Lower Ground Floor, Shop 10',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411014',
    phone: '+91 20 6689 0088',
    email: 'phoenix.pune@newme.asia',
    latitude: 18.5621,
    longitude: 73.9168,
    googleMapsUrl: 'https://maps.google.com/?q=Phoenix+Marketcity+Pune+Viman+Nagar',
    instagramUrl: 'https://instagram.com/newme.asia',
    websiteUrl: 'https://newme.asia/',
    storeLocatorUrl: 'https://newme.asia/stores/',
    active: true,
  },
  settings: {
    defaultDurationMin: 45,
    bookingIntervalMin: 30,
    dailyCapacity: 24,
    maxSimultaneousBookings: 2,
    minNoticeHours: 2,
    maxAdvanceDays: 30,
    bufferTimeMin: 10,
    maxGuests: 3,
    autoConfirm: true,
  },
  businessHours: [
    { id: 'bh-1', dayOfWeek: 'Monday', dayIndex: 1, isOpen: true, openTime: '10:30', closeTime: '21:30' },
    { id: 'bh-2', dayOfWeek: 'Tuesday', dayIndex: 2, isOpen: true, openTime: '10:30', closeTime: '21:30' },
    { id: 'bh-3', dayOfWeek: 'Wednesday', dayIndex: 3, isOpen: true, openTime: '10:30', closeTime: '21:30' },
    { id: 'bh-4', dayOfWeek: 'Thursday', dayIndex: 4, isOpen: true, openTime: '10:30', closeTime: '21:30' },
    { id: 'bh-5', dayOfWeek: 'Friday', dayIndex: 5, isOpen: true, openTime: '10:30', closeTime: '22:00' },
    { id: 'bh-6', dayOfWeek: 'Saturday', dayIndex: 6, isOpen: true, openTime: '10:30', closeTime: '22:00' },
    { id: 'bh-0', dayOfWeek: 'Sunday', dayIndex: 0, isOpen: true, openTime: '10:30', closeTime: '22:00' },
  ],
  blockedDates: [
    {
      id: 'blk-1',
      date: '2026-10-25',
      isFullDay: false,
      startTime: '15:00',
      endTime: '17:30',
      reason: 'VIP Styling Preview & Press Event',
      createdAt: '2026-10-01T10:00:00.000Z',
    },
  ],
  appointmentTypes: [
    {
      id: 'apt-personal-styling',
      name: 'Personal Styling',
      slug: 'personal-styling',
      description: 'One-on-one session with a NEWME fashion stylist to curate signature head-to-toe outfits suited to your body silhouette and aesthetic.',
      duration: 45,
      capacity: 1,
      active: true,
      tag: 'Most Popular',
      image: '/src/assets/images/newme_styling_lounge_1790918325187.jpg',
    },
    {
      id: 'apt-outfit-consultation',
      name: 'Outfit Consultation',
      slug: 'outfit-consultation',
      description: 'Quick trend advice and outfit coordination for college, weekend brunches, or travel capsules.',
      duration: 30,
      capacity: 2,
      active: true,
      tag: 'Express',
      image: '/src/assets/images/newme_fashion_collection_1790918312190.jpg',
    },
    {
      id: 'apt-occasion-styling',
      name: 'Occasion Styling',
      slug: 'occasion-styling',
      description: 'Complete fit discovery for sundowners, cocktail parties, birthday nights, and milestone celebrations.',
      duration: 60,
      capacity: 1,
      active: true,
      tag: 'Comprehensive',
      image: '/src/assets/images/newme_pune_hero_1790918151414.jpg',
    },
    {
      id: 'apt-party-look',
      name: 'Party Look Consultation',
      slug: 'party-look',
      description: 'Glamour, statement silhouettes, tailored co-ords, and bold party accessories curated in real-time.',
      duration: 45,
      capacity: 2,
      active: true,
      tag: 'Night Out',
      image: '/src/assets/images/newme_store_interior_1790918295601.jpg',
    },
    {
      id: 'apt-casual-look',
      name: 'Casual Look Consultation',
      slug: 'casual-look',
      description: 'Upgrade your daily rotation with relaxed denim, oversized tees, knit tops, and versatile layering pieces.',
      duration: 30,
      capacity: 2,
      active: true,
      tag: 'Daily Fits',
      image: '/src/assets/images/newme_fashion_collection_1790918312190.jpg',
    },
    {
      id: 'apt-workwear-styling',
      name: 'Workwear Styling',
      slug: 'workwear-styling',
      description: 'Modern corporate chic, tailored blazers, structured trousers, and sleek desk-to-dinner co-ords.',
      duration: 45,
      capacity: 1,
      active: true,
      tag: 'Sharp & Modern',
      image: '/src/assets/images/newme_pune_hero_1790918151414.jpg',
    },
    {
      id: 'apt-shopping-assistance',
      name: 'Shopping Assistance',
      slug: 'shopping-assistance',
      description: 'Dedicated fitting room reserve, size pulls, and seamless expedited checkout with a retail advisor.',
      duration: 30,
      capacity: 2,
      active: true,
      tag: 'Convenience',
      image: '/src/assets/images/newme_store_interior_1790918295601.jpg',
    },
  ],
  collections: [
    {
      id: 'col-new-drops',
      name: 'New Drops',
      slug: 'new-drops',
      description: 'The latest Gen-Z cuts, tailored statement pieces, and viral TikTok silhouettes fresh on the Pune floor.',
      image: '/src/assets/images/newme_pune_hero_1790918151414.jpg',
      externalUrl: 'https://newme.asia/collections/new-arrivals',
      featured: true,
      active: true,
      sortOrder: 1,
      itemCountLabel: '120+ Styles',
    },
    {
      id: 'col-party-edit',
      name: 'Party Edit',
      slug: 'party-edit',
      description: 'Satin slip dresses, cutout minis, metallic trims, and nocturnal glamour for Pune nights.',
      image: '/src/assets/images/newme_fashion_collection_1790918312190.jpg',
      externalUrl: 'https://newme.asia/collections/party-wear',
      featured: true,
      active: true,
      sortOrder: 2,
      itemCountLabel: '85+ Styles',
    },
    {
      id: 'col-coord-moments',
      name: 'Co-ord Moments',
      slug: 'coord-moments',
      description: 'Effortless two-piece sets designed for elevated streetwear, brunch chic, and airport looks.',
      image: '/src/assets/images/newme_styling_lounge_1790918325187.jpg',
      externalUrl: 'https://newme.asia/collections/co-ords',
      featured: true,
      active: true,
      sortOrder: 3,
      itemCountLabel: '90+ Styles',
    },
    {
      id: 'col-dresses',
      name: 'Dresses',
      slug: 'dresses',
      description: 'Sculptural maxis, ribbed bodycons, flowy midi sundresses, and corset silhouettes.',
      image: '/src/assets/images/newme_store_interior_1790918295601.jpg',
      externalUrl: 'https://newme.asia/collections/dresses',
      featured: true,
      active: true,
      sortOrder: 4,
      itemCountLabel: '140+ Styles',
    },
    {
      id: 'col-workwear',
      name: 'Workwear',
      slug: 'workwear',
      description: 'Clean lines, relaxed tailored blazers, pleated wide-leg trousers, and contemporary formalwear.',
      image: '/src/assets/images/newme_pune_hero_1790918151414.jpg',
      externalUrl: 'https://newme.asia/collections/workwear',
      featured: true,
      active: true,
      sortOrder: 5,
      itemCountLabel: '60+ Styles',
    },
    {
      id: 'col-everyday-fits',
      name: 'Everyday Fits',
      slug: 'everyday-fits',
      description: 'Essential crop tops, graphic tees, soft cargo joggers, and timeless lightweight knits.',
      image: '/src/assets/images/newme_fashion_collection_1790918312190.jpg',
      externalUrl: 'https://newme.asia/collections/tops',
      featured: true,
      active: true,
      sortOrder: 6,
      itemCountLabel: '110+ Styles',
    },
    {
      id: 'col-denim',
      name: 'Denim',
      slug: 'denim',
      description: 'High-waist wide leg jeans, barrel cuts, raw hemlines, and oversized denim jackets.',
      image: '/src/assets/images/newme_store_interior_1790918295601.jpg',
      externalUrl: 'https://newme.asia/collections/bottoms',
      featured: false,
      active: true,
      sortOrder: 7,
      itemCountLabel: '45+ Styles',
    },
    {
      id: 'col-accessories',
      name: 'Accessories & Bags',
      slug: 'accessories-bags',
      description: 'Statement chunky jewellery, baguette shoulder bags, sunglasses, and finishing touches.',
      image: '/src/assets/images/newme_styling_lounge_1790918325187.jpg',
      externalUrl: 'https://newme.asia/collections/accessories',
      featured: false,
      active: true,
      sortOrder: 8,
      itemCountLabel: '70+ Styles',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      imageUrl: '/src/assets/images/newme_store_interior_1790918295601.jpg',
      title: 'Phoenix Marketcity Store Interior',
      altText: 'NEWME Phoenix Marketcity Pune modern store interior with sleek racks and warm lighting',
      category: 'STORE',
      featured: true,
      sortOrder: 1,
    },
    {
      id: 'gal-2',
      imageUrl: '/src/assets/images/newme_pune_hero_1790918151414.jpg',
      title: 'The Pune Editorial',
      altText: 'High fashion editorial lookbook featuring NEWME contemporary green and white co-ords',
      category: 'FASHION',
      featured: true,
      sortOrder: 2,
    },
    {
      id: 'gal-3',
      imageUrl: '/src/assets/images/newme_styling_lounge_1790918325187.jpg',
      title: 'Personal Styling Lounge',
      altText: 'Private styling suite with curated garments and illuminated mirror at Phoenix Marketcity',
      category: 'STORE',
      featured: true,
      sortOrder: 3,
    },
    {
      id: 'gal-4',
      imageUrl: '/src/assets/images/newme_fashion_collection_1790918312190.jpg',
      title: 'Green Silk Midi Look',
      altText: 'Lookbook showcase of elegant partywear dress with tailored silhouettes',
      category: 'LOOKS',
      featured: true,
      sortOrder: 4,
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      customerName: 'Riya Deshmukh',
      rating: 5,
      reviewText: 'The personal styling session at Phoenix Marketcity was phenomenal! Found the exact sage green co-ord set I had been eyeing on Instagram. The stylist was so patient and attentive.',
      reviewDate: '2026-09-24',
      verified: true,
      approved: true,
      featured: true,
      visitType: 'Personal Styling',
    },
    {
      id: 'rev-2',
      customerName: 'Ananya Kulkarni',
      rating: 5,
      reviewText: 'Such a breath of fresh air in Viman Nagar. The fitting rooms and aesthetic are unmatched. Clean, stylish, and super helpful staff who helped me put together a weekend trip wardrobe.',
      reviewDate: '2026-09-18',
      verified: true,
      approved: true,
      featured: true,
      visitType: 'Outfit Consultation',
    },
    {
      id: 'rev-3',
      customerName: 'Tanvi Shah',
      rating: 5,
      reviewText: 'Booked a Party Look consultation for my 22nd birthday. My stylist pulled 5 perfect fits within 10 minutes. Ended up buying the look and getting countless compliments!',
      reviewDate: '2026-09-12',
      verified: true,
      approved: true,
      featured: true,
      visitType: 'Party Look Consultation',
    },
    {
      id: 'rev-4',
      customerName: 'Sanya Mirchandani',
      rating: 5,
      reviewText: 'Seamless booking experience! No waiting in long weekend trial room lines at Phoenix. Walked straight in to a reserved room with looks pre-selected.',
      reviewDate: '2026-08-30',
      verified: true,
      approved: true,
      featured: false,
      visitType: 'Shopping Assistance',
    },
  ],
  promotions: [
    {
      id: 'promo-1',
      title: 'The Pune Drop — Fresh Fits In-Store',
      subtitle: 'Exclusive offline drops every Thursday at Phoenix Marketcity Pune.',
      image: '/src/assets/images/newme_pune_hero_1790918151414.jpg',
      ctaText: 'Book Your Styling Visit',
      ctaUrl: '/book-visit',
      startDate: '2026-09-01',
      endDate: '2026-11-30',
      active: true,
    },
  ],
  users: [
    {
      id: 'usr-admin-1',
      name: 'Adarsh Rathod',
      email: 'admin@newme.asia',
      phone: '+91 98230 11223',
      passwordHash: 'admin123', // Demo auth hash
      role: 'SUPER_ADMIN',
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
    {
      id: 'usr-staff-1',
      name: 'Kavya Nair',
      email: 'staff@newme.asia',
      phone: '+91 98230 44556',
      passwordHash: 'staff123',
      role: 'STAFF',
      createdAt: '2026-09-05T00:00:00.000Z',
      updatedAt: '2026-09-05T00:00:00.000Z',
    },
    {
      id: 'usr-cust-1',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      passwordHash: 'customer123',
      role: 'CUSTOMER',
      createdAt: '2026-09-10T00:00:00.000Z',
      updatedAt: '2026-09-10T00:00:00.000Z',
    },
  ],
  profiles: [
    {
      id: 'prof-1',
      userId: 'usr-cust-1',
      stylePreferences: ['Minimalist Chic', 'Tailored Co-ords', 'Satin Slip Dresses'],
      preferredSize: 'M',
      occasionPreferences: ['Weekend Sundowners', 'Cafe Workdays', 'Concerts'],
      notes: 'Loves earth tones, sage greens, and crisp whites.',
    },
  ],
  appointments: [
    {
      id: 'apt-001',
      bookingNumber: 'NME-PUN-2026-000101',
      customerId: 'usr-cust-1',
      customerName: 'Priya Sharma',
      customerEmail: 'priya@example.com',
      customerPhone: '+91 98765 43210',
      appointmentTypeId: 'apt-personal-styling',
      appointmentTypeName: 'Personal Styling',
      storeId: 'store-pune-phoenix',
      date: '2026-10-05',
      startTime: '14:00',
      endTime: '14:45',
      guestCount: 1,
      stylePreference: 'Modern Minimalist',
      occasion: 'Weekend Brunch & Cocktails',
      preferredSize: 'M',
      specialRequest: 'Looking for matching green co-ord sets and accessories.',
      instagramHandle: '@priya.style',
      preferredContactMethod: 'WHATSAPP',
      status: 'CONFIRMED',
      staffNotes: 'Room 2 reserved. Pre-hung the Sage Green blazer set.',
      createdAt: '2026-09-28T14:20:00.000Z',
      updatedAt: '2026-09-28T14:20:00.000Z',
    },
    {
      id: 'apt-002',
      bookingNumber: 'NME-PUN-2026-000098',
      customerName: 'Simran Mehta',
      customerEmail: 'simran.m@example.com',
      customerPhone: '+91 91234 56789',
      appointmentTypeId: 'apt-party-look',
      appointmentTypeName: 'Party Look Consultation',
      storeId: 'store-pune-phoenix',
      date: '2026-09-28',
      startTime: '16:00',
      endTime: '16:45',
      guestCount: 2,
      stylePreference: 'Glamour / Cutouts',
      occasion: 'Birthday Party',
      preferredSize: 'S',
      specialRequest: 'Need sparkly outfits and mini shoulder bags.',
      status: 'COMPLETED',
      staffNotes: 'Customer purchased 2 outfits. Very satisfied.',
      createdAt: '2026-09-25T11:00:00.000Z',
      updatedAt: '2026-09-28T17:00:00.000Z',
    },
    {
      id: 'apt-003',
      bookingNumber: 'NME-PUN-2026-000105',
      customerName: 'Aarushi Patil',
      customerEmail: 'aarushi.p@example.com',
      customerPhone: '+91 99887 76655',
      appointmentTypeId: 'apt-workwear-styling',
      appointmentTypeName: 'Workwear Styling',
      storeId: 'store-pune-phoenix',
      date: '2026-10-06',
      startTime: '11:30',
      endTime: '12:15',
      guestCount: 1,
      stylePreference: 'Contemporary Suiting',
      occasion: 'New Job in Cyber City Magarpatta',
      preferredSize: 'L',
      status: 'PENDING',
      createdAt: '2026-10-01T09:15:00.000Z',
      updatedAt: '2026-10-01T09:15:00.000Z',
    },
  ],
  auditLogs: [
    {
      id: 'log-1',
      action: 'SYSTEM_INITIALIZE',
      performedBy: 'System',
      details: 'Initialized NEWME Phoenix Marketcity Pune store system.',
      timestamp: '2026-09-01T00:00:00.000Z',
    },
  ],
};

class Database {
  private data: DatabaseSchema;
  private isSaving = false;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading database file, using initial data:', err);
    }
    this.saveData(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }

  private saveData(data: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
    this.data[key] = value;
    this.saveData(this.data);
  }

  public update(updater: (data: DatabaseSchema) => void) {
    updater(this.data);
    this.saveData(this.data);
  }

  public logAudit(action: string, performedBy: string, details: string) {
    const log: AuditLog = {
      id: 'log-' + Date.now(),
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.saveData(this.data);
  }
}

export const db = new Database();
