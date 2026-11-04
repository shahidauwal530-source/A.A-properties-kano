const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('aa_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  signUp: (body: any) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  signIn: (body: any) => request('/auth/signin', { method: 'POST', body: JSON.stringify(body) }),
  adminLogin: (body: any) => request('/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  forgotPassword: (phone: string) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ phone }) }),
  resetPassword: (body: any) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  updateProfile: (body: any) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Properties
  getProperties: (query: Record<string, string> = {}) => {
    const params = new URLSearchParams(query).toString();
    return request(`/properties${params ? `?${params}` : ''}`);
  },
  getPropertyById: (id: string) => request(`/properties/${id}`),
  getFeaturedProperties: () => request('/properties/featured'),
  createProperty: (body: any) => request('/properties', { method: 'POST', body: JSON.stringify(body) }),
  updateProperty: (id: string, body: any) => request(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProperty: (id: string) => request(`/properties/${id}`, { method: 'DELETE' }),
  updatePropertyStatus: (id: string, status: string) => request(`/properties/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  trackWhatsApp: (id: string) => request(`/properties/${id}/whatsapp-click`, { method: 'POST' }),

  // Favorites
  toggleFavorite: (propertyId: string) => request(`/favorites/${propertyId}`, { method: 'POST' }),
  getFavorites: () => request('/favorites'),

  // Inspections
  createInspection: (body: any) => request('/inspections', { method: 'POST', body: JSON.stringify(body) }),
  getMyInspections: () => request('/my-inspections'),
  getAllInspections: () => request('/inspections'),
  updateInspectionStatus: (id: string, status: string) => request(`/inspections/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Admin Dashboard
  getAdminDashboard: () => request('/admin/dashboard'),
};
