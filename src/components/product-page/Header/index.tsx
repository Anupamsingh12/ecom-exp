"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Heart, Share2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SingleProductDetails, Variants } from "@/types/product.types";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAtom } from "jotai";
import { cartAtom, CartItem } from "@/app/store";
import { addItemToCart } from "@/services/cart";
import { setItem } from "@/lib/localStorageControl";
import toast from "react-hot-toast";

interface ProductPageProps {
  product: SingleProductDetails;
}

export default function ProductPage({ product }: ProductPageProps) {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useAtom(cartAtom);

  const [selectedVariant, setSelectedVariant] = useState<Variants>({
    ...product?.varients[0],
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Calculate discounted price
  const originalPrice = Number.parseFloat(product.price);
  const discountedPrice =
    originalPrice - (originalPrice * product.discountPercent) / 100;
  const variantPrice =
    discountedPrice + Number.parseFloat(selectedVariant.additionalPrice);

  const availableSizes = useMemo(() => {
    return Array.from(
      new Set(
        product?.varients
          .filter((v) => v.color === selectedVariant.color)
          .map((v) => v.size)
      )
    );
  }, [product?.varients, selectedVariant.color]);

  const availableColors = useMemo(() => {
    return Array.from(new Set(product?.varients.map((v) => v.color)));
  }, [product?.varients]);

  const handleSizeChange = (size: string) => {
    const variant = product?.varients.find(
      (v) => v.size === size && v.color === selectedVariant.color
    );
    if (variant) {
      setSelectedVariant({ ...variant });
      setSelectedImageIndex(0);
    }
  };

  const handleColorChange = (color: string) => {
    const variantsForColor = product?.varients.filter((v) => v.color === color);
    const variant =
      variantsForColor.find((v) => v.size === selectedVariant.size) ||
      variantsForColor[0];
    if (variant) {
      setSelectedVariant({ ...variant });
      setSelectedImageIndex(0);
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(
      Math.max(1, Math.min(product.stockQuantity, quantity + change))
    );
  };

  // Helper to update cart items
  const getUpdatedCartItems = (
    cartItems: CartItem[],
    cartItem: CartItem,
    quantity: number
  ) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.variantId === cartItem.variantId
    );
    let updatedItems;
    if (existingItemIndex > -1) {
      updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      updatedItems = [...cartItems, cartItem];
    }
    return updatedItems;
  };

  const handleAddToCart = async () => {
    const cartItem: CartItem = {
      variantId: selectedVariant?.varient_id,
      sku: selectedVariant?.sku,
      quantity,
      product_name: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      image: selectedVariant.images,
      price: variantPrice,
    };

    try {
      if (isAuthenticated) {
        // Add to server cart if user is authenticated
        await addItemToCart(selectedVariant?.varient_id, quantity);

        // Update global state after successful server update
        const updatedItems = getUpdatedCartItems(
          cart.items,
          cartItem,
          quantity
        );
        const newCart = {
          items: updatedItems,
        };
        setCart(newCart);
      } else {
        // Add to local cart if user is not authenticated
        const updatedItems = getUpdatedCartItems(
          cart.items,
          cartItem,
          quantity
        );
        const newCart = {
          items: updatedItems,
        };
        setCart(newCart);
        setItem("cart", JSON.stringify(updatedItems));
      }
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-lg bg-card h-[400px] md:h-[500px]">
            <img
              src={
                selectedVariant?.images[selectedImageIndex] ||
                "/placeholder.svg"
              }
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {selectedVariant?.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                  selectedImageIndex === index
                    ? "border-primary"
                    : "border-border"
                )}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`₹{product.name} view ₹{index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  (4.8) 124 reviews
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-pretty leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              ₹{variantPrice.toFixed(2)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
            <span>
              {product.discountPercent > 0 && (
                <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                  -{product.discountPercent}%
                </span>
              )}
            </span>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold mb-3">
              Color: {selectedVariant.color}
            </h3>
            <div className="flex gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={cn(
                    "px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium",
                    selectedVariant.color === color
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold mb-3">Size: {selectedVariant.size}</h3>
            <div className="flex gap-2">
              {availableSizes.map((size) => {
                const isAvailable = product?.varients.some(
                  (v) => v.size === size && v.color === selectedVariant.color
                );
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    disabled={!isAvailable}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium min-w-[3rem]",
                      selectedVariant.size === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : isAvailable
                        ? "border-border bg-background hover:border-primary/50"
                        : "border-border bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity and Stock */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Quantity</h3>
              <span className="text-sm text-muted-foreground">
                {product.stockQuantity} in stock
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stockQuantity}
                  className="h-10 w-10 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
              disabled={!product.isActive || product.stockQuantity === 0}
            >
              Add to Cart - ₹{(variantPrice * quantity).toFixed(2)}
            </Button>
            {/* <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
