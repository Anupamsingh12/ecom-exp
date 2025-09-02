"use client";

import React, { useEffect } from "react";
import PhotoSection from "./PhotoSection";
import { Product, Products, Variants } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
// import Rating from "@/components/ui/Rating"; // remove if not used
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";
import {
  setColorSelection,
  setSizeSelection,
} from "@/lib/features/products/productsSlice";

interface HeaderProps {
  data: Products & {
    basePrice?: number;
    finalPrice?: number;
    selectedVariant?: Variants;
  };
}

const Header = ({ data }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const price = parseFloat(data.price);
  const discount = data.discountPercent;
  const { colorSelection, sizeSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  // Get the selected variant and its additional price
  const selectedVariant = data.varients.find(
    (v) => v.color === colorSelection.name && v.size === sizeSelection
  );
  const additionalPrice = selectedVariant
    ? parseFloat(selectedVariant.additionalPrice)
    : 0;

  // Set default variant selection when component mounts
  useEffect(() => {
    if (data.varients && data.varients.length > 0) {
      // Get first available color
      const firstVariant = data.varients[0];
      const firstColor = {
        name: firstVariant.color,
        code:
          firstVariant.color.toLowerCase() === "white"
            ? "bg-white border border-gray-200"
            : `bg-[${firstVariant.color}]`,
      };

      // Dispatch default color
      dispatch(setColorSelection(firstColor));

      // Dispatch default size for the selected color
      const sizesForColor = data.varients
        .filter((v) => v.color === firstVariant.color)
        .map((v) => v.size);

      if (sizesForColor.length > 0) {
        dispatch(setSizeSelection(sizesForColor[0]));
      }
    }
  }, [data.varients, dispatch]);

  // Calculate final price including discount and additional price from variant
  const basePrice = price + additionalPrice;
  const finalPrice =
    discount > 0 ? basePrice - (basePrice * discount) / 100 : basePrice;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <PhotoSection data={data} />
      </div>

      <div>
        <h1
          className={cn([
            integralCF.className,
            "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
          ])}
        >
          {data.name}
        </h1>

        {/* Rating removed since not in data */}

        <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
          <span className="font-bold text-black text-2xl sm:text-[32px]">
            ${Math.round(finalPrice)}
          </span>

          {discount > 0 && (
            <>
              <span className="font-bold text-black/40 line-through text-2xl sm:text-[32px]">
                ${price}
              </span>
              <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                -{discount}%
              </span>
            </>
          )}
        </div>

        <p className="text-sm sm:text-base text-black/60 mb-5">
          {data.description}
        </p>

        <hr className="h-[1px] border-t-black/10 mb-5" />

        <ColorSelection variants={data.varients} />
        <hr className="h-[1px] border-t-black/10 my-5" />
        <SizeSelection varients={data.varients} />
        <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />

        <AddToCardSection
          data={{
            ...data,
            selectedVariant,
            basePrice: basePrice,
            finalPrice: finalPrice,
          }}
        />
      </div>
    </div>
  );
};

export default Header;
