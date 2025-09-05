import { apiCall } from "@/lib/apiUtils";

export interface CartResponse {
  id: number;
  product_name: string;
  size: string;
  color: string;
  image: string[];
  sku: string;
  price: string;
  additionalPrice: string;
  quantity: number;
}

export interface AddToCartRequest {
  id: number;
  varient_id: number;
  quantity: number;
  user_id: number;
  updatedAt: string;
  createdAt: string;
}

export async function getCartItems() {
  return apiCall<CartResponse[]>("/carts");
}

export async function addItemToCart(varient_id: number, quantity: number) {
  return apiCall<AddToCartRequest>("/carts", {
    method: "POST",
    body: { varient_id, quantity },
  });
}

export async function removeItemFromCart(productId: number) {
  return apiCall<CartResponse>(`/carts`, {
    method: "PATCH",
    body: {
      cart_id: productId,
    },
  });
}
