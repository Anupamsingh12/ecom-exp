"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsForm } from "./sections/generalSettings";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
};

export function ProfilePageTab() {
  return (
    <Tabs defaultValue="settings" className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-xl">
        <TabsTrigger value="settings">General settings</TabsTrigger>
        {/* <TabsTrigger value="cart">Cart</TabsTrigger> */}
        {/* <TabsTrigger value="checkout">Checkout</TabsTrigger> */}
      </TabsList>

      <div className="mt-6">
        <TabsContent value="settings">
          <GeneralSettingsForm />
        </TabsContent>

        {/* <TabsContent value="cart">
          <CartSection
            cart={cart}
            onChangeQty={updateQty}
            onRemove={removeItem}
            onClear={clearCart}
          />
        </TabsContent>

        <TabsContent value="checkout">
          <CheckoutSection
            cart={cart}
            onChangeQty={updateQty}
            onRemove={removeItem}
          />
        </TabsContent> */}
      </div>
    </Tabs>
  );
}
