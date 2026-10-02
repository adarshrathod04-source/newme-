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
  dayOfWeek: string;
  dayIndex: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  notes?: string;
}

export interface BlockedDate {
  id: string;
  date: string;
  startTime?: string | null;
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
  duration: number;
  capacity: number;
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
  date: string;
  startTime: string;
  endTime: string;
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

export interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
  remainingCapacity: number;
  status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  reason?: string;
}

export interface AvailabilityResponse {
  date: string;
  dayOfWeek: string;
  isOpen: boolean;
  reason?: string;
  openTime?: string;
  closeTime?: string;
  duration?: number;
  slots: TimeSlot[];
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
  rating: number;
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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
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

export interface DashboardMetrics {
  totalBookings: number;
  todayCount: number;
  upcomingCount: number;
  pendingCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  todaySchedule: Appointment[];
  typeDistribution: Record<string, number>;
  hourCounts: Record<string, number>;
  bookingsByDate: Record<string, number>;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastVisit: string;
  upcomingVisit: string;
  status: string;
  preferences: string[];
  preferredSize: string;
}
