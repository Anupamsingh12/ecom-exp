"use client";

import React from "react";
import { PiTrashFill } from "react-icons/pi";
import Link from "next/link";
import CartCounter from "@/components/ui/CartCounter";
import { Button } from "../ui/button";
import { CartItem, cartAtom } from "@/app/store";
import { useAtom } from "jotai";
import { setItem } from "@/lib/localStorageControl";
import { useAuth } from "@/lib/hooks/useAuth";
import { removeItemFromCart, addItemToCart } from "@/services/cart";
import toast from "react-hot-toast";

type ProductCardProps = {
  data: CartItem;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const [cart, setCart] = useAtom(cartAtom);
  const { isAuthenticated } = useAuth();

  const handleRemoveItem = async () => {
    if (isAuthenticated) {
      try {
        // Call the API to remove item from server
        await removeItemFromCart(data?.variantId);

        // Update local state after successful API call
        const updatedItems = cart.items.filter((item) => item.sku !== data.sku);
        setCart({ items: updatedItems });
        toast.success("Item removed from cart");
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    } else {
      // For unauthenticated users, just update localStorage
      const updatedItems = cart.items.filter((item) => item.sku !== data.sku);
      setCart({ items: updatedItems });
      setItem("cart", JSON.stringify(updatedItems));
      toast.success("Item removed from cart");
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    try {
      if (isAuthenticated) {
        if (newQuantity > data.quantity) {
          // Adding items
          await addItemToCart(data.variantId, newQuantity);
        } else if (newQuantity < data.quantity) {
          // Removing items
          await removeItemFromCart(data.variantId);
          if (newQuantity > 0) {
            // If not removing all items, add back the new quantity
            await addItemToCart(data.variantId, newQuantity);
          }
        }
      }
      
      // Update local state after successful API call or for unauthenticated users
      const updatedItems = cart.items.map((item) => {
        if (item.sku === data.sku) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      const newCart = {
        items: updatedItems,
      };
      setCart(newCart);
      setItem("cart", JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast.error("Failed to update cart quantity");
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="bg-[#F0EEED] rounded-lg w-full min-w-[100px] max-w-[100px] sm:max-w-[124px] aspect-square overflow-hidden">
        <img
          src={data.image[0]}
          width={295}
          height={298}
          className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
          alt={data.product_name}
        />
      </div>
      <div className="flex w-full self-stretch flex-col">
        <div className="flex items-center justify-between">
          <span className="text-black font-bold text-base xl:text-xl">
            {data.product_name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 md:h-9 md:w-9"
            onClick={handleRemoveItem}
          >
            <PiTrashFill className="text-xl md:text-2xl text-red-600" />
          </Button>
        </div>
        <div className="-mt-1">
          <span className="text-black text-xs md:text-sm mr-1">Size:</span>
          <span className="text-black/60 text-xs md:text-sm">{data.size}</span>
        </div>
        <div className="mb-auto -mt-1.5">
          <span className="text-black text-xs md:text-sm mr-1">Color:</span>
          <span className="text-black/60 text-xs md:text-sm">{data.color}</span>
        </div>
        <div className="flex items-center flex-wrap justify-between">
          <div className="flex items-center space-x-[5px] xl:space-x-2.5">
            <span className="font-bold text-black text-xl xl:text-2xl">
              ${data.price.toFixed(2)}
            </span>
          </div>
          <CartCounter
            initialValue={data.quantity}
            onAdd={() => handleQuantityChange(data.quantity + 1)}
            onRemove={() => {
              if (data.quantity === 1) {
                handleRemoveItem();
              } else {
                handleQuantityChange(data.quantity - 1);
              }
            }}
            isZeroDelete
            className="px-5 py-3 max-h-8 md:max-h-10 min-w-[105px] max-w-[105px] sm:max-w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
