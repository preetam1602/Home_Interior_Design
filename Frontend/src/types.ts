export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'color' | 'material' | 'furniture' | 'decor';
  unit?: string; // e.g. "/ litre", "/sq.ft", or empty
  room?: 'living' | 'bedroom' | 'dining' | 'office' | 'kitchen' | 'decor';
}

export interface SavedDesign {
  id: number;
  name: string;
  price: number;
  image: string;
  room: 'living' | 'bedroom' | 'dining' | 'office' | 'kitchen' | 'decor';
}

export interface BookingData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface FeedbackData {
  name: string;
  phone: string;
  email: string;
  message: string;
}
