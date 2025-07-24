export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  guidelines?: string;
  features: string[];
  tags: string[];
  rating: number;
  inStock: boolean;
  relatedProducts?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export type ProductCategory = 
  | 'neural-interfaces'
  | 'quantum-devices'
  | 'biotech'
  | 'cyber-security'
  | 'ai-assistants'
  | 'energy-systems'
  | 'transportation'
  | 'communication';