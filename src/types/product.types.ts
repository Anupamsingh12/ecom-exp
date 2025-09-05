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
  varient_id: number;
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
  clothing_type_id: number;
  created_by: string | null;
  createdAt: string;
  updatedAt: string;
  image: string;
  varients: string;
}

export interface ProductsResponse {
  count: number;
  rows: Products[];
}

export interface SingleProductDetails {
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
  image: string[];
  brand_id: number;
  category_id: number;
  clothing_type_id: number;
  size: string;
  color: string;
  sku: string;
  additionalPrice: string;
  stock: number;
  product_id: number;
  varients: Variants[];
}
