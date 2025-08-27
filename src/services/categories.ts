
import { apiCall } from '@/lib/apiUtils';
import { Category } from '@/types/Category.types';

// Get all products
export async function getAllCategory() {
  return apiCall<Category[]>('/categories');
}

