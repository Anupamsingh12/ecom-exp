"use client";

import CartCounter from "@/components/ui/CartCounter";
import React, { useState } from "react";
import AddToCartBtn from "./AddToCartBtn";
import { Products, Variants } from "@/types/product.types";
import toast from "react-hot-toast";

interface AddToCardSectionProps {
  data: Products & {
    basePrice: number;
    finalPrice: number;
    selectedVariant?: Variants;
  };
}

const AddToCardSection = ({ data }: AddToCardSectionProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddSuccess = () => {
    toast.success('Product added to cart successfully!');
    setQuantity(1); // Reset quantity to 1 after successful add to cart
  };

  return (
    <div className="fixed md:relative w-full bg-white border-t md:border-none border-black/5 bottom-0 left-0 p-4 md:p-0 z-10 flex items-center justify-between sm:justify-start md:justify-center">
      <CartCounter onAdd={setQuantity} onRemove={setQuantity} initialValue={quantity} />
      <AddToCartBtn data={{ ...data, quantity }} onAddSuccess={handleAddSuccess} />
    </div>
  );
};

export default AddToCardSection;
