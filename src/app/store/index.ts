import { atom } from "jotai";
import { User } from "@/types/user.types";

// Auth atoms
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);

// cart atom
export interface CartItem {
  variantId: number;
  quantity: number;
  product_name: string;
  size: string;
  color: string;
  image: string[];
  price: number;
  sku: string;
}

export interface Cart {
  items: CartItem[];
}

export const cartAtom = atom<Cart>({
  items: [],
});
