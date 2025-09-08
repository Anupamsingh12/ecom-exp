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

export interface ShippingAddress {
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  order_item_id: number;
  item_id: number;
  quantity: number;
  price: string;
}

export interface BaseOrder {
  id: number;
  total_amount: string;
  user_id: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
  payment_method: string;
  shipping_address_id: number;
  createdAt: string;
  updatedAt: string;
  payment_status: 'pending' | 'paid' | 'failed';
}

export interface OrderResponse extends BaseOrder {
  shipping_name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface SingleOrderResponse extends BaseOrder {
  shipping_address: ShippingAddress;
  items: any[];
}