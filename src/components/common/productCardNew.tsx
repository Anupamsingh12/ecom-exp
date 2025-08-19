// components/products/ProductCardNew.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Products } from "@/types/product.types";

type ProductCardNewProps = {
  data: Products;
};

const ProductCardNew = ({ data }: ProductCardNewProps) => {
  const originalPrice = parseFloat(data.price);
  const discount = data.discountPercent;
  const discountedPrice =
    discount > 0
      ? originalPrice - (originalPrice * discount) / 100
      : originalPrice;

  return (
    <Link
      href={`/shop/product/${data?.id}/${data?.name.split(" ").join("-")}`}
      className="flex flex-col items-start aspect-auto"
    >
      <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
        <img
          src={data.image}
          width={295}
          height={298}
          className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
          alt={data.name}
          //   priority
        />
      </div>
      <strong className="text-black xl:text-xl">{data.name}</strong>

      {/* Optional static rating display */}
      <div className="flex items-end mb-1 xl:mb-2">
        {/* You can add a <Rating /> component here if needed */}
        <span className="text-black text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
          {data.varients} variant{data.varients !== "1" ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
        <span className="font-bold text-black text-xl xl:text-2xl">
          ${discountedPrice.toFixed(2)}
        </span>
        {discount > 0 && (
          <>
            <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
              ${originalPrice.toFixed(2)}
            </span>
            <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
              -{discount}%
            </span>
          </>
        )}
      </div>
    </Link>
  );
};

export default ProductCardNew;
