import { apiCall } from "@/lib/apiUtils";
import { CreateOrderPayload, OrderResponse } from "@/types/orders.type";

// add new
export async function createOrder(orderPayload: CreateOrderPayload) {
  return apiCall<any>("/orders", {
    method: "POST",
    body: orderPayload,
  });
}

// get all
export async function getShippingAddress() {
  return apiCall<OrderResponse>("/orders");
}

// update
export async function updateOrder(
  orderId: number,
  orderPayload: Partial<CreateOrderPayload>
) {
  return apiCall<OrderResponse>(`/orders/${orderId}`, {
    method: "PATCH",
    body: orderPayload,
  });
}
