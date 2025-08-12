export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
};

// types/product.ts

export interface Products {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPercent: number;
  stockQuantity: number;
  isActive: boolean;
  created_by: string | null;
  createdAt: string;
  updatedAt: string;
  image: string;
  varients: string;
}

export interface ProductsResponse {
  count: number;
  rows: Product[];
}
