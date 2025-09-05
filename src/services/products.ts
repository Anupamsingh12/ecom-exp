// services/productService.ts

import { apiCall } from '@/lib/apiUtils';
import type { ProductsResponse, SingleProductDetails } from '@/types/product.types';

export async function getAllProducts() {
  return apiCall<ProductsResponse>('/products');
}
export async function getProductById(productId: string) {
  return apiCall<SingleProductDetails>('/products/'+ productId);
}
