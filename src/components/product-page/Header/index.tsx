import React from "react";
import PhotoSection from "./PhotoSection";
import { Products } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
// import Rating from "@/components/ui/Rating"; // remove if not used
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";

const Header = ({ data }: { data: Products }) => {
  const price = parseFloat(data.price);
  const discount = data.discountPercent;

  const finalPrice = discount > 0
    ? price - (price * discount) / 100
    : price;

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

        <ColorSelection varients={data.varients} />
        <hr className="h-[1px] border-t-black/10 my-5" />
        <SizeSelection varients={data.varients} />
        <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />

        <AddToCardSection data={data} />
      </div>
    </div>
  );
};

export default Header;
