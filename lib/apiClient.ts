// Frontend API Client for communicating with the Hono backend
// ALL data flows through this client — no localStorage, no mock data.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://hsrpg-api.pginbengaluru72.workers.dev';

export class ApiError extends Error {
  code: string;
  status: number;
  
  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (error: any) {
    throw new ApiError(
      'Network Error: Could not connect to StaySure API. Please check your connection.',
      'NETWORK_ERROR',
      0
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.error?.message || 'An unexpected error occurred.',
      data?.error?.code || 'UNKNOWN_ERROR',
      response.status
    );
  }

  return data.data as T;
}

// Server-side fetch (for SSR pages — no cookies)
export async function fetchPublicApi<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error?.message || 'API error');
  }
  return data.data as T;
}

// ------------------------------------------------------------
// AUTHENTICATION
// ------------------------------------------------------------

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    fetchApi<any>('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    fetchApi<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () =>
    fetchApi<any>('/api/auth/logout', { method: 'POST' }),
  getMe: () =>
    fetchApi<any>('/api/auth/me', { method: 'GET' }),
  updateProfile: (data: { name?: string; phone?: string }) =>
    fetchApi<any>('/api/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    fetchApi<any>('/api/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
};

// ------------------------------------------------------------
// PUBLIC APIs — No auth, used on the public website
// ------------------------------------------------------------

export const publicApi = {
  searchProperties: (query: Record<string, string> = {}) => {
    const qs = new URLSearchParams(query).toString();
    return fetchApi<any>(`/api/public/properties?${qs}`, { method: 'GET' });
  },
  getPropertyBySlug: (slug: string) =>
    fetchApi<any>(`/api/public/properties/${slug}`, { method: 'GET' }),
  getLocalities: () =>
    fetchApi<any>('/api/public/localities', { method: 'GET' }),
  getLocalityBySlug: (slug: string) =>
    fetchApi<any>(`/api/public/localities/${slug}`, { method: 'GET' }),
  logLead: (data: {
    propertyId: string;
    source: 'WHATSAPP_CLICK' | 'PHONE_CLICK' | 'CONTACT_FORM';
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
  }) => fetchApi<any>('/api/public/leads', { method: 'POST', body: JSON.stringify(data) }),
  getBroadcast: () =>
    fetchApi<any>('/api/broadcast', { method: 'GET' }),
};

// ------------------------------------------------------------
// OWNER DASHBOARD
// ------------------------------------------------------------

export const ownerApi = {
  getDashboardStats: () =>
    fetchApi<any>('/api/owner/dashboard', { method: 'GET' }),
  getProperties: () =>
    fetchApi<any>('/api/owner/properties', { method: 'GET' }),
  createProperty: (data: any) =>
    fetchApi<any>('/api/owner/properties', { method: 'POST', body: JSON.stringify(data) }),
  getProperty: (id: string) =>
    fetchApi<any>(`/api/owner/properties/${id}`, { method: 'GET' }),
  updateProperty: (id: string, data: any) =>
    fetchApi<any>(`/api/owner/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProperty: (id: string) =>
    fetchApi<any>(`/api/owner/properties/${id}`, { method: 'DELETE' }),
  submitProperty: (id: string) =>
    fetchApi<any>(`/api/owner/properties/${id}/submit`, { method: 'POST' }),

  getRooms: (propertyId: string) =>
    fetchApi<any>(`/api/owner/properties/${propertyId}/rooms`, { method: 'GET' }),
  createRoom: (propertyId: string, data: any) =>
    fetchApi<any>(`/api/owner/properties/${propertyId}/rooms`, { method: 'POST', body: JSON.stringify(data) }),
  updateRoom: (roomId: string, data: any) =>
    fetchApi<any>(`/api/owner/rooms/${roomId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRoom: (roomId: string) =>
    fetchApi<any>(`/api/owner/rooms/${roomId}`, { method: 'DELETE' }),

  uploadMedia: (propertyId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('propertyId', propertyId);
    return fetchApi<any>('/api/owner/upload', { method: 'POST', body: formData });
  },

  getLeads: () =>
    fetchApi<any>('/api/owner/leads', { method: 'GET' }),
};

// ------------------------------------------------------------
// ADMIN DASHBOARD
// ------------------------------------------------------------

export const adminApi = {
  getOverview: () =>
    fetchApi<any>('/api/admin/overview', { method: 'GET' }),
  
  // Verifications
  getVerifications: () =>
    fetchApi<any>('/api/admin/verifications', { method: 'GET' }),
  verifyProperty: (id: string) =>
    fetchApi<any>(`/api/admin/verifications/${id}/verify`, { method: 'POST' }),
  rejectProperty: (id: string, reason: string) =>
    fetchApi<any>(`/api/admin/verifications/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Owners
  getOwners: () =>
    fetchApi<any>('/api/admin/owners', { method: 'GET' }),
  createOwner: (data: { email: string; name: string; phone?: string; tempPassword: string }) =>
    fetchApi<any>('/api/admin/owners/create', { method: 'POST', body: JSON.stringify(data) }),
  toggleOwner: (id: string) =>
    fetchApi<any>(`/api/admin/owners/${id}/toggle`, { method: 'PUT' }),

  // Properties
  getAllProperties: () =>
    fetchApi<any>('/api/admin/properties', { method: 'GET' }),

  // Leads
  getAllLeads: () =>
    fetchApi<any>('/api/admin/leads', { method: 'GET' }),

  // Localities
  getLocalities: () =>
    fetchApi<any>('/api/admin/localities', { method: 'GET' }),
  createLocality: (data: { name: string; area: string; city?: string }) =>
    fetchApi<any>('/api/admin/localities', { method: 'POST', body: JSON.stringify(data) }),
  updateLocality: (id: string, data: any) =>
    fetchApi<any>(`/api/admin/localities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Broadcast
  sendBroadcast: (data: { message: string; level?: string; target?: string }) =>
    fetchApi<any>('/api/admin/broadcast', { method: 'POST', body: JSON.stringify(data) }),

  // Audit
  getAuditLogs: (page = 1) =>
    fetchApi<any>(`/api/admin/audit-logs?page=${page}`, { method: 'GET' }),
};
