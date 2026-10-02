import {
  StoreInfo,
  StoreSettings,
  BusinessDayHours,
  BlockedDate,
  AppointmentType,
  Appointment,
  AvailabilityResponse,
  CollectionItem,
  GalleryItem,
  ReviewItem,
  PromotionItem,
  User,
  DashboardData,
  CustomerSummary,
} from '../types';

const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `HTTP error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Store & Settings
  async getStore(): Promise<{ store: StoreInfo; settings: StoreSettings }> {
    const res = await fetch(`${BASE_URL}/store`);
    return handleResponse(res);
  },

  async updateStore(data: Partial<StoreInfo>): Promise<{ success: boolean; store: StoreInfo }> {
    const res = await fetch(`${BASE_URL}/store`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateSettings(data: Partial<StoreSettings>): Promise<{ success: boolean; settings: StoreSettings }> {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Business Hours
  async getBusinessHours(): Promise<BusinessDayHours[]> {
    const res = await fetch(`${BASE_URL}/business-hours`);
    return handleResponse(res);
  },

  async updateBusinessHours(hours: BusinessDayHours[]): Promise<{ success: boolean; businessHours: BusinessDayHours[] }> {
    const res = await fetch(`${BASE_URL}/business-hours`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours }),
    });
    return handleResponse(res);
  },

  // Blocked Dates
  async getBlockedDates(): Promise<BlockedDate[]> {
    const res = await fetch(`${BASE_URL}/blocked-dates`);
    return handleResponse(res);
  },

  async createBlockedDate(data: Omit<BlockedDate, 'id' | 'createdAt'>): Promise<BlockedDate> {
    const res = await fetch(`${BASE_URL}/blocked-dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteBlockedDate(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/blocked-dates/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Appointment Types
  async getAppointmentTypes(activeOnly = false): Promise<AppointmentType[]> {
    const res = await fetch(`${BASE_URL}/appointment-types${activeOnly ? '?active=true' : ''}`);
    return handleResponse(res);
  },

  async createAppointmentType(data: Partial<AppointmentType>): Promise<AppointmentType> {
    const res = await fetch(`${BASE_URL}/appointment-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateAppointmentType(id: string, data: Partial<AppointmentType>): Promise<AppointmentType> {
    const res = await fetch(`${BASE_URL}/appointment-types/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteAppointmentType(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/appointment-types/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Availability Engine
  async getAvailability(date: string, typeId: string): Promise<AvailabilityResponse> {
    const res = await fetch(`${BASE_URL}/availability?date=${encodeURIComponent(date)}&typeId=${encodeURIComponent(typeId)}`);
    return handleResponse(res);
  },

  // Appointments
  async getAppointments(filters?: { date?: string; status?: string; customerId?: string; search?: string }): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.customerId) params.append('customerId', filters.customerId);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${BASE_URL}/appointments?${params.toString()}`);
    return handleResponse(res);
  },

  async getAppointment(id: string): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments/${id}`);
    return handleResponse(res);
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Collections
  async getCollections(activeOnly = false): Promise<CollectionItem[]> {
    const res = await fetch(`${BASE_URL}/collections${activeOnly ? '?active=true' : ''}`);
    return handleResponse(res);
  },

  async createCollection(data: Partial<CollectionItem>): Promise<CollectionItem> {
    const res = await fetch(`${BASE_URL}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateCollection(id: string, data: Partial<CollectionItem>): Promise<CollectionItem> {
    const res = await fetch(`${BASE_URL}/collections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteCollection(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/collections/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Gallery
  async getGallery(category?: string): Promise<GalleryItem[]> {
    const res = await fetch(`${BASE_URL}/gallery${category ? `?category=${category}` : ''}`);
    return handleResponse(res);
  },

  async createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${BASE_URL}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Reviews
  async getReviews(approvedOnly = true): Promise<ReviewItem[]> {
    const res = await fetch(`${BASE_URL}/reviews${approvedOnly ? '?approved=true' : ''}`);
    return handleResponse(res);
  },

  async createReview(data: Partial<ReviewItem>): Promise<ReviewItem> {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateReview(id: string, data: Partial<ReviewItem>): Promise<ReviewItem> {
    const res = await fetch(`${BASE_URL}/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Promotions
  async getPromotions(activeOnly = true): Promise<PromotionItem[]> {
    const res = await fetch(`${BASE_URL}/promotions${activeOnly ? '?active=true' : ''}`);
    return handleResponse(res);
  },

  async createPromotion(data: Partial<PromotionItem>): Promise<PromotionItem> {
    const res = await fetch(`${BASE_URL}/promotions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updatePromotion(id: string, data: Partial<PromotionItem>): Promise<PromotionItem> {
    const res = await fetch(`${BASE_URL}/promotions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deletePromotion(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/promotions/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Admin Dashboard & Customers
  async getDashboardData(): Promise<DashboardData> {
    const res = await fetch(`${BASE_URL}/admin/dashboard`);
    return handleResponse(res);
  },

  async getAdminCustomers(): Promise<CustomerSummary[]> {
    const res = await fetch(`${BASE_URL}/admin/customers`);
    return handleResponse(res);
  },

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(data: { name: string; email: string; phone?: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    return handleResponse(res);
  },
};
