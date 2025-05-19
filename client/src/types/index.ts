// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'dealer' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

// Watch types
export interface Watch {
  id: number;
  brand: string;
  model: string;
  reference: string;
  size: number;
  material: string;
  price: number;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

// Favorite types
export interface Favorite {
  id: number;
  userId: number;
  watchId: number;
  createdAt?: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface GoogleLoginCredentials {
  token: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Filter types
export interface WatchFilters {
  brand: string[];
  size: number[];
  material: string[];
  priceRange: [number, number] | null;
}

// Watch state
export interface WatchState {
  watches: Watch[];
  filteredWatches: Watch[];
  favorites: Watch[];
  filters: WatchFilters;
  isLoading: boolean;
  error: string | null;
}

// Form types
export interface WatchFormData {
  brand: string;
  model: string;
  reference: string;
  size: number;
  material: string;
  price: number;
  imageUrl: string;
}
