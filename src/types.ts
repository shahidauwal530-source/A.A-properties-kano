export interface User {
  id: string;
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  favorites: string[];
  location?: string;
  isVerified: boolean;
  createdAt?: string;
}

export type PropertyType = 'Gida' | 'Fili' | 'Shago' | 'Company' | 'Warehouse' | 'Hall';
export type DealType = 'Haya - Per Year' | 'Haya - Per Day' | 'Saya - Total';
export type DocumentType = 'C of O' | 'R of O' | 'Tenancy Agreement' | 'None';
export type PropertyStatus = 'Available' | 'Sold' | 'Rented' | 'Draft';

export interface Property {
  _id: string;
  id?: string;
  title: string;
  type: PropertyType;
  area: string;
  price: number;
  dealType: DealType;
  bedrooms?: number;
  bathrooms?: number;
  size?: string;
  document: DocumentType;
  water?: string;
  power?: string;
  fence: boolean;
  parking: boolean;
  security: boolean;
  description: string;
  images: string[];
  videoUrl?: string;
  mapPin?: string;
  status: PropertyStatus;
  views: number;
  whatsappClicks: number;
  favoritesCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Inspection {
  _id: string;
  id?: string;
  propertyId: string;
  propertyTitle: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Done' | 'Cancelled';
  createdAt: string;
}

export interface DashboardStats {
  totalProperties: number;
  totalAvailable: number;
  totalSold: number;
  totalRented: number;
  totalViews: number;
  totalUsers: number;
  totalInspections: number;
  totalWhatsAppClicks: number;
}
