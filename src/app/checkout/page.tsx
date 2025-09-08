"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ShippingMethod } from "@/types/checkout.types";
import { integralCF } from "@/styles/fonts";
import { ShippingAddressSection } from "@/components/checkout/ShippingAddressSection";

import { useEffect } from "react";
import { getCartItems } from "@/services/cart";
import { PaymentMethodSection } from "@/components/checkout/PaymentMethod";
import { PaymentMethod } from "@/types/payment.types";
import { useRouter } from "next/navigation";
import { createOrder } from "@/services/orders";
import toast from "react-hot-toast";
import { initializePayment } from "@/services/payment";
import { useAtom } from "jotai";
import { userAtom } from "../store";

interface CheckoutCartItem {
  id: number;
  varient_id: number;
  title: string;
  price: number;
  qty: number;
  imageAlt: string;
  imageUrl: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CheckoutCartItem[]>([]);
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function fetchCart() {
      try {
        const cart = await getCartItems();
        const mapped = (cart || []).map((item: any) => ({
          id: item.id,
          varient_id: item.varient_id,
          title: item.product_name,
          price: Number(item.price) + Number(item.additionalPrice || 0),
          qty: item.quantity,
          imageAlt: item.product_name,
          imageUrl:
            item.image && item.image.length > 0
              ? item.image[0]
              : "/placeholder.svg",
        }));
        setItems(mapped);
      } catch (e) {
        setItems([]);
      }
    }
    fetchCart();
  }, []);

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
  const discount = 0;
  const total = Math.max(0, subtotal + shipping + taxes - discount);


  const [user] = useAtom(userAtom);
  const handleRazorpayPayment = async (order: any) => {
    try {
      if (!order) {
        throw new Error("Order ID is required");
      }
      if (!order) {
        throw new Error("Failed to fetch order details");
      }

      const response = await initializePayment({
        order_id: parseInt(order.order_id),
        amount: total.toFixed(0).toString(),
      });

      if (!response.success) {
        throw new Error("Failed to initialize payment");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total,
        currency: "INR",
        name: "E-Commerce Store",
        description: "Payment for your order",
        image: "https://example.com/your_logo",
        order_id: response.order.id,
        callback_url: "",
        method: {
          upi: true,
          netbanking: true,
          card: true,
          wallet: true,
          emi: false,
        },
        prefill: {
          name: order?.shipping_address?.name,
          email: user?.email || "",
          contact: order?.shipping_address?.phone,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#0D0D0D",
        },
        handler: function (res: any) {
          router.push(`/orders/${order.order_id}?type=success`);
        },
        modal: {
          ondismiss: function () {
            router.push("/profile?type=payment_failed");
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Failed to initialize payment. Please try again.");
    } finally {

    }
  };
  async function handleProceedToPayment() {
    try {
      const orderPayload = {
        total_amount: total,
        payment_method: paymentMethod as "card" | "cash",
        shipping_address_id: selectedAddressId!,
        items: items.map((item) => ({
          item_id: item.varient_id,
          quantity: item.qty,
          price: item.price,
        })),
      };

      const order = await createOrder(orderPayload);
      if(paymentMethod==='card'){
        handleRazorpayPayment(order);
      }else{
        router.push(`/orders/${order?.order_id}?type=cod_success`);
      }
      // toast.success("Order created successfully!");
    } catch (error) {
      console.error("Failed to create order:", error);
    }
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
          <ShippingAddressSection
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
          />

          <PaymentMethodSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

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
                      src={item.imageUrl || "/placeholder.svg"}
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
                        ₹{item.price.toFixed(2)} × {item.qty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ₹{(item.price * item.qty).toFixed(2)}
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
                        ₹5.00
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
                        ₹12.00
                      </span>
                    </label>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Taxes ({Math.round(taxRate * 100)}%)
                    </span>
                    <span>₹{taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span>₹{discount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleProceedToPayment}
                  disabled={!selectedAddressId || !paymentMethod}
                  aria-label="Proceed to Payment"
                >
                  {paymentMethod && paymentMethod==='card'?"Proceed to Payment":'Place order'}
                </Button>

                {(!selectedAddressId || !paymentMethod) && (
                  <p className="text-xs text-red-500">
                    Please select both shipping address and payment method to
                    proceed
                  </p>
                )}

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
