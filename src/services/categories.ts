
import { apiCall } from '@/lib/apiUtils';
import { Category } from '@/types/category.types';

// Get all products
export async function getAllCategory() {
  return apiCall<Category[]>('/categories');
}

