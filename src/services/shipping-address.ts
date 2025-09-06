import { apiCall } from "@/lib/apiUtils";
import {
  ShippingAddressPayload,
  ShippingAddressResponse,
} from "@/types/shippingAddress.types";

// add new
export async function addShippingAddress(address: ShippingAddressPayload) {
  return apiCall<any>("/shipping-address", {
    method: "POST",
    body: address,
  });
}

// get all
export async function getShippingAddress() {
  return apiCall<ShippingAddressResponse>("/shipping-address");
}

// get single
export async function getShippingAddressById(id: string) {
  return apiCall<any>(`/shipping-address/${id}`);
}

// update
export async function updateShippingAddress(id: string, address: any) {
  return apiCall<any>(`/shipping-address/${id}`, {
    method: "PUT",
    body: address,
  });
}
