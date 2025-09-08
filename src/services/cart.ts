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
    method: "DELETE",
    body: {
      cart_id: productId,
    },
  });
}
export async function emptyCart() {
  return apiCall<CartResponse>(`/carts`, {
    method: "DELETE",
    body: {
      all: true,
    },
  });
}
export async function updateCartQuantity(cart_id: number, quantity: number) {
  return apiCall<CartResponse>(`/carts/${cart_id}`, {
    method: "PATCH",
    body: {
      quantity,
    },
  });
}

