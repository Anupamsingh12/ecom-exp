export interface CreateOrderPayload {
  total_amount: number;
  payment_method: "card" | "paypal" | "cash";
  shipping_address_id: number;
  items: {
    item_id: number;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderPayload {
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

export interface OrderResponse {
  id: number;
  total_amount: string;
  user_id: number;
  status: string;
  payment_method: string;
  shipping_address_id: number;
  createdAt: string;
  updatedAt: string;
  payment_status: string;
  shipping_name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}
