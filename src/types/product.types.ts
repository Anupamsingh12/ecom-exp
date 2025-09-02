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
export type Category = {
  id: number;
  name: string;
  image: string;
};

// types/product.ts

export interface Variants {
  size: string;
  color: string;
  sku: string;
  additionalPrice: string;
  images: string[];
}

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
  varients: Variants[];
}

export interface ProductsResponse {
  count: number;
  rows: Product[];
}
