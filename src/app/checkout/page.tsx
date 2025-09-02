"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  CartItem,
  ShippingFormData,
  ShippingMethod,
} from "@/types/checkout.types";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { integralCF } from "@/styles/fonts";
import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";

const demoItems: CartItem[] = [
  {
    id: "sku-tee",
    title: "Essential Cotton Tee",
    price: 24,
    qty: 2,
    imageAlt: "White cotton tee",
    imageUrl: "/white-cotton-tee-product-image.png",
  },
  {
    id: "sku-jeans",
    title: "Dark Wash Denim",
    price: 68,
    qty: 1,
    imageAlt: "Dark wash denim jeans",
    imageUrl: "/dark-wash-denim-jeans-product-image.png",
  },
];

export default function CheckoutPage() {
  const [items] = useState<CartItem[]>(demoItems);
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");
  const [form, setForm] = useState<ShippingFormData>({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    notes: "",
  });

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const shipping = shippingMethod === "express" ? 12 : 5;
  const taxRate = 0.08;
  const taxes = useMemo(
    () => Math.round(subtotal * taxRate * 100) / 100,
    [subtotal]
  );
  const discount = 0; // hook up any discounts/coupons here
  const total = Math.max(0, subtotal + shipping + taxes - discount);

  const isFormValid =
    form.fullName.trim() &&
    form.email.trim() &&
    form.address1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.postalCode.trim() &&
    form.country.trim();

  async function handleProceedToPayment() {
    // Build a payload you can pass directly to a Razorpay-init function or API route later
    const orderPayload = {
      customer: {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        address: {
          line1: form.address1,
          line2: form.address2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        notes: form.notes,
      },
      shippingMethod,
      amounts: {
        subtotal,
        shipping,
        taxes,
        discount,
        total,
        currency: "USD", // swap to your live currency
      },
      items: items.map((i) => ({
        id: i.id,
        title: i.title,
        unitPrice: i.price,
        qty: i.qty,
      })),
    };

    // Example next steps:
    // 1) POST to your /api/orders to create an order (and/or Razorpay order_id)
    // 2) Initialize Razorpay checkout on the client with the created order_id
    // For now, just demo:
    alert("Proceeding to payment… (Razorpay integration coming soon)");
    // window.location.href = "/payment"  // optionally route to a payment screen
  }

  return (
    <main className="max-w-frame mx-auto px-4 xl:px-0">
      <h2
        className={cn([
          integralCF.className,
          "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
        ])}
      >
        Checkout
      </h2>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: Shipping form + Items summary list */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <ShippingForm form={form} setForm={setForm} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.imageUrl ||
                        "/placeholder.svg?height=64&width=64&query=product image" ||
                        "/placeholder.svg"
                      }
                      alt={item.imageAlt}
                      width={64}
                      height={64}
                      className="size-16 rounded-md object-cover"
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} × {item.qty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Your cart is empty.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Sticky summary */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Shipping Method */}
                <div className="space-y-2">
                  <Label className="text-sm">Shipping Method</Label>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={(val: ShippingMethod) =>
                      setShippingMethod(val)
                    }
                    className="grid grid-cols-1 gap-2"
                  >
                    <label
                      htmlFor="ship-standard"
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-2 rounded-md border p-3 transition-colors",
                        shippingMethod === "standard" && "ring-2 ring-primary"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="ship-standard" value="standard" />
                        <span className="text-sm font-medium">
                          Standard (3–5 days)
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        $5.00
                      </span>
                    </label>

                    <label
                      htmlFor="ship-express"
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-2 rounded-md border p-3 transition-colors",
                        shippingMethod === "express" && "ring-2 ring-primary"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="ship-express" value="express" />
                        <span className="text-sm font-medium">
                          Express (1–2 days)
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        $12.00
                      </span>
                    </label>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Taxes ({Math.round(taxRate * 100)}%)
                    </span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span>${discount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleProceedToPayment}
                  disabled={!isFormValid}
                  aria-label="Proceed to Payment"
                >
                  Proceed to Payment
                </Button>

                <p className="text-xs text-muted-foreground">
                  You’ll be able to review your order before completing payment.
                </p>
              </CardContent>
            </Card>
          </div>
        </aside>
      </section>
    </main>
  );
}
