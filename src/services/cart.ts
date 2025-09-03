import { apiCall } from '@/lib/apiUtils';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export const cartService = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    return apiCall<Cart>('/carts');
  },

  // Add item to cart
  addToCart: async (varient_id: number, quantity: number): Promise<Cart> => {
    return apiCall<Cart>('/carts', {
      method: 'POST',
      body: { varient_id, quantity }
    });
  },

  // Remove item from cart
  removeFromCart: async (productId: string): Promise<Cart> => {
    return apiCall<Cart>(`/carts/${productId}`, {
      method: 'PATCH'
    });
  },
};
