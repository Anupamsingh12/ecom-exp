import { useEffect, useRef, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { cartAtom } from '@/app/store';
import { getItem, setItem } from '@/lib/localStorageControl';
import { addItemToCart, getCartItems } from '@/services/cart';

export const useCartInitialization = (isAuthenticated: boolean) => {
  const [cart, setCart] = useAtom(cartAtom);
  const [isLoading, setIsLoading] = useState(false);
  const hasInitialized = useRef(false);
  const isMigrating = useRef(false);

  const migrateCartToServer = useCallback(async (parsedCart: any[]) => {
    if (isMigrating.current) return;
    isMigrating.current = true;

    try {
      // Migrate items to server one time only
      for (const item of parsedCart) {
        await addItemToCart(item?.variantId, item?.quantity);
      }
      // Clear localStorage after successful migration
      setItem("cart", JSON.stringify([]));
      setCart({ items: [] });
    } catch (error) {
      console.error("Error migrating cart items to server:", error);
    } finally {
      isMigrating.current = false;
    }
  }, [setCart]);

  const fetchCartFromServer = useCallback(async () => {
    try {
      const cartItems = await getCartItems();
      const formattedCartItems = cartItems?.map((item: any) => ({
        variantId: item.id,
        quantity: item.quantity,
        product_name: item.product_name,
        size: item.size,
        color: item.color,
        image: item.image,
        price: Number(item.price),
        sku: item.sku,
      }));
      setCart({ items: formattedCartItems });
    } catch (error) {
      console.error("Error fetching cart items from server:", error);
    }
  }, [setCart]);

  useEffect(() => {
    const initializeCart = async () => {
      if (hasInitialized.current) return;
      
      const storedCart = getItem("cart");
      if (!storedCart) {
        hasInitialized.current = true;
        return;
      }

      try {
        const parsedCart = JSON.parse(storedCart);
        
        if (isAuthenticated) {
          setIsLoading(true);
          if (parsedCart.length > 0) {
            await migrateCartToServer(parsedCart);
          }
          await fetchCartFromServer();
          setIsLoading(false);
        } else {
          setCart({ items: parsedCart });
        }
        
        hasInitialized.current = true;
      } catch (error) {
        console.error("Error initializing cart:", error);
        setIsLoading(false);
      }
    };

    initializeCart();
  }, [isAuthenticated, migrateCartToServer, fetchCartFromServer, setCart]);

  return { cart, isLoading };
};
