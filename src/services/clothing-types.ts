
import { apiCall } from '@/lib/apiUtils';
import { ClothingTypes } from '@/types/clothing-types';

// Get all products
export async function getAllClothingTypes() {
  return apiCall<ClothingTypes[]>('/clothing-types');
}

