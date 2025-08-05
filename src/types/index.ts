// src/types/index.ts
export interface User {
    id: string;
    nombreCompleto: string;
    correoElectronico: string;
    telefono: string;
    ciudadRegion: string;
    role: 'user' | 'worker';
    photoURL?: string;
    isActive: boolean;
    createdAt: any;
    updatedAt?: any;
  }
  
  export interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    priceType: 'fixed' | 'hourly';
    providerId: string;
    providerName: string;
    providerPhoto?: string;
    images: string[];
    rating: number;
    reviewCount: number;
    isActive: boolean;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    createdAt: any;
    updatedAt?: any;
  }
  
  export interface Booking {
    id: string;
    serviceId: string;
    clientId: string;
    workerId: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    scheduledDate: any;
    completedDate?: any;
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    notes?: string;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    createdAt: any;
    updatedAt?: any;
  }
  
  export interface Review {
    id: string;
    bookingId: string;
    reviewerId: string;
    reviewedId: string;
    rating: number;
    comment: string;
    createdAt: any;
  }