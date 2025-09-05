"use client";

import { cartAtom } from "@/app/store";
import { useAtom } from "jotai";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { getItem } from "@/lib/localStorageControl";

const CartBtn = () => {
  const [cart, setCart] = useAtom(cartAtom);

  // Initialize cart from localStorage on component mount
  useEffect(() => {
    const storedCart = getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart({
          items: parsedCart,
        });
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }, [setCart]);

  return (
    <Link href="/cart" className="relative mr-[14px] p-1">
      <ShoppingCart />
      {cart?.items?.length > 0 && (
        <span className="border bg-black text-white rounded-full w-fit-h-fit px-1 text-xs absolute -top-3 left-1/2 -translate-x-1/2">
          {cart?.items?.length}
        </span>
      )}
    </Link>
  );
};

export default CartBtn;
