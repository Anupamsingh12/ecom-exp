"use client";

import {
  Color,
  setColorSelection,
} from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { IoMdCheckmark } from "react-icons/io";

// Color code mapping
const colorToCode: { [key: string]: string } = {
  Brown: "bg-[#4F4631]",
  Green: "bg-[#314F4A]",
  Blue: "bg-blue-800",
  White: "bg-white border border-gray-200",
  Black: "bg-black",
};

const ColorSelection = ({ variants }: { variants: any[] }) => {
  const dispatch = useAppDispatch();

  const { colorSelection } = useAppSelector(
    (state: RootState) => state.products
  );

  // Extract unique colors from variants
  const availableColors = useMemo(() => {
    const uniqueColors = Array.from(
      new Set(variants.map((variant) => variant.color))
    );
    return uniqueColors.map((color) => ({
      name: color,
      code: colorToCode[color] || `bg-[${color}]`, // Fallback if color code not found
    }));
  }, [variants]);

  return (
    <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Select Colors
      </span>
      <div className="flex items-center flex-wrap space-x-3 sm:space-x-4">
        {availableColors.map((color, index) => (
          <button
            key={index}
            type="button"
            className={cn([
              color.code,
              "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center",
            ])}
            onClick={() => dispatch(setColorSelection(color))}
          >
            {colorSelection.name === color.name && (
              <IoMdCheckmark
                className={cn(
                  "text-base",
                  color.name.toLowerCase() === "white"
                    ? "text-black"
                    : "text-white"
                )}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelection;
