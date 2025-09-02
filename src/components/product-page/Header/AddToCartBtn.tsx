"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Products, Variants } from "@/types/product.types";
import React from "react";

interface AddToCartBtnProps {
  data: Products & {
    quantity: number;
    basePrice: number;
    finalPrice: number;
    selectedVariant?: Variants;
  };
  onAddSuccess?: () => void;
}

const AddToCartBtn = ({ data, onAddSuccess }: AddToCartBtnProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (!data.selectedVariant) return;
    
    dispatch(
      addToCart({
        id: data.id,
        name: data.name,
        srcUrl: data?.selectedVariant?.images[0] || data.image,
        price: data.basePrice,
        attributes: [data.selectedVariant.size, data.selectedVariant.color],
        discount: {
          amount: 0,
          percentage: data.discountPercent
        },
        quantity: data.quantity,
      })
    );
    
    // Call the success callback to reset counter
    if (onAddSuccess) {
      onAddSuccess();
    }
  };

  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={!data.selectedVariant}
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
