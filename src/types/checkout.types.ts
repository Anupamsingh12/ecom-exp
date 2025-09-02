export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  imageAlt: string;
  imageUrl?: string;
};

export type ShippingFormData = {
  fullName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
};

export type ShippingMethod = "standard" | "express";
