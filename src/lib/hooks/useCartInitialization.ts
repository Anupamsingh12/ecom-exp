import { useEffect, useRef, useState, useCallback } from "react";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/store";
import { getItem, removeItem } from "@/lib/localStorageControl";
import { addItemToCart, getCartItems } from "@/services/cart";

export const useCartInitialization = (isAuthenticated: boolean) => {
  const [cart, setCart] = useAtom(cartAtom);
  const [isLoading, setIsLoading] = useState(false);
  const hasInitialized = useRef(false);

  // ⏫ Only migrates once on login
  const migrateCartToServer = useCallback(async (parsedCart: any[]) => {
    try {
      for (const item of parsedCart) {
        await addItemToCart(item?.variantId, item?.quantity);
      }

      // 🧹 Clear cart from localStorage once done
      removeItem("cart");
    } catch (error) {
      console.error("Error migrating cart items to server:", error);
    }
  }, []);

  const fetchCartFromServer = useCallback(async () => {
    try {
      const cartItems = await getCartItems();
      const formattedCartItems = cartItems?.map((item: any) => ({
        id: item.id,
        variantId: item.varient_id,
        quantity: item.quantity,
        product_name: item.product_name,
        size: item.size,
        color: item.color,
        image: item.image,
        price: Number(item.price),
        sku: item.sku,
        cart_id: item.id,
      }));
      setCart({ items: formattedCartItems });
    } catch (error) {
      console.error("Error fetching cart items from server:", error);
    }
  }, [setCart]);

  useEffect(() => {
    const initializeCart = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      const storedCart = getItem("cart");
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];

      if (isAuthenticated) {
        setIsLoading(true);

        // 🔐 Only migrate if there are items to migrate
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          await migrateCartToServer(parsedCart);
        }

        await fetchCartFromServer();
        setIsLoading(false);
      } else {
        // 👤 Guest user — use localStorage cart
        setCart({ items: parsedCart });
      }
    };

    initializeCart();
  }, [isAuthenticated, migrateCartToServer, fetchCartFromServer, setCart]);

  return { cart, isLoading };
};
