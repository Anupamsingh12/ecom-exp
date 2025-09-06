export interface ShippingAddressPayload {
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface ShippingAddress {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddressResponse {
  count: number;
  rows: ShippingAddress[];
}
