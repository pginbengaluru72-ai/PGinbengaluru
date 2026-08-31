// Frontend API Client for communicating with the Hono backend

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

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

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

// ------------------------------------------------------------
// AUTHENTICATION
// ------------------------------------------------------------

export const authApi = {
  login: (credentials: any) => fetchApi<any>('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data: any) => fetchApi<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchApi<any>('/api/auth/logout', { method: 'POST' }),
  getMe: () => fetchApi<any>('/api/auth/me', { method: 'GET' }),
  changePassword: (data: any) => fetchApi<any>('/api/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
};

// ------------------------------------------------------------
// OWNER DASHBOARD
// ------------------------------------------------------------

export const ownerApi = {
  getDashboardStats: () => fetchApi<any>('/api/owner/dashboard', { method: 'GET' }),
  getProperties: () => fetchApi<any>('/api/owner/properties', { method: 'GET' }),
  createProperty: (data: any) => fetchApi<any>('/api/owner/properties', { method: 'POST', body: JSON.stringify(data) }),
  getProperty: (id: string) => fetchApi<any>(`/api/owner/properties/${id}`, { method: 'GET' }),
  submitProperty: (id: string) => fetchApi<any>(`/api/owner/properties/${id}/submit`, { method: 'POST' }),
  
  getRooms: (propertyId: string) => fetchApi<any>(`/api/owner/properties/${propertyId}/rooms`, { method: 'GET' }),
  createRoom: (propertyId: string, data: any) => fetchApi<any>(`/api/owner/properties/${propertyId}/rooms`, { method: 'POST', body: JSON.stringify(data) }),
  createBed: (roomId: string, data: any) => fetchApi<any>(`/api/owner/rooms/${roomId}/beds`, { method: 'POST', body: JSON.stringify(data) }),
  
  getApplications: () => fetchApi<any>('/api/owner/applications', { method: 'GET' }),
  acceptApplication: (id: string) => fetchApi<any>(`/api/owner/applications/${id}/accept`, { method: 'POST' }),
  
  uploadMedia: (propertyId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('propertyId', propertyId);
    return fetchApi<any>('/api/owner/upload', { method: 'POST', body: formData });
  }
};

// ------------------------------------------------------------
// SUPER ADMIN DASHBOARD
// ------------------------------------------------------------

export const adminApi = {
  getOverview: () => fetchApi<any>('/api/admin/overview', { method: 'GET' }),
  getVerifications: () => fetchApi<any>('/api/admin/verifications', { method: 'GET' }),
  verifyProperty: (id: string) => fetchApi<any>(`/api/admin/verifications/${id}/verify`, { method: 'POST' }),
  rejectProperty: (id: string, reason: string) => fetchApi<any>(`/api/admin/verifications/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  createOwner: (data: any) => fetchApi<any>('/api/admin/owners/create', { method: 'POST', body: JSON.stringify(data) }),
  getAuditLogs: (page = 1) => fetchApi<any>(`/api/admin/audit-logs?page=${page}`, { method: 'GET' }),
};

// ------------------------------------------------------------
// CUSTOMER MARKETPLACE
// ------------------------------------------------------------

export const customerApi = {
  searchProperties: (query: Record<string, string> = {}) => {
    const qs = new URLSearchParams(query).toString();
    return fetchApi<any>(`/api/customer/properties?${qs}`, { method: 'GET' });
  },
  getPropertyDetail: (id: string) => fetchApi<any>(`/api/customer/properties/${id}`, { method: 'GET' }),
  applyForPg: (data: any) => fetchApi<any>('/api/customer/applications', { method: 'POST', body: JSON.stringify(data) }),
  getMyApplications: () => fetchApi<any>('/api/customer/applications', { method: 'GET' }),
  saveToFavorites: (propertyId: string) => fetchApi<any>('/api/customer/favorites', { method: 'POST', body: JSON.stringify({ propertyId }) }),
};
