"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CreditCard, Banknote, Shield, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";

type PaymentMethod = "card" | "cash" | "paypal";

type CardFormData = {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
};

type OrderSummary = {
  subtotal: number;
  shipping: number;
  taxes: number;
  discount: number;
  total: number;
  items: Array<{
    id: string;
    title: string;
    price: number;
    qty: number;
  }>;
};

// Mock order data - in real app, this would come from checkout page or API
const mockOrderSummary: OrderSummary = {
  subtotal: 116.0,
  shipping: 5.0,
  taxes: 9.28,
  discount: 0,
  total: 130.28,
  items: [
    { id: "sku-tee", title: "Essential Cotton Tee", price: 24, qty: 2 },
    { id: "sku-jeans", title: "Dark Wash Denim", price: 68, qty: 1 },
  ],
};

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardForm, setCardForm] = useState<CardFormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Get payment method from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const method = urlParams.get("method") as PaymentMethod;
    if (method && ["card", "cash", "paypal"].includes(method)) {
      setPaymentMethod(method);
    }
  }, []);

  const handleCardInputChange =
    (field: keyof CardFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Format card number with spaces
      if (field === "cardNumber") {
        value = value
          .replace(/\s/g, "")
          .replace(/(.{4})/g, "$1 ")
          .trim();
        if (value.length > 19) return; // Max 16 digits + 3 spaces
      }

      // Format expiry date
      if (field === "expiryDate") {
        value = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
        if (value.length > 5) return;
      }

      // Format CVV
      if (field === "cvv") {
        value = value.replace(/\D/g, "");
        if (value.length > 4) return;
      }

      setCardForm((prev) => ({ ...prev, [field]: value }));
    };

  const isCardFormValid =
    cardForm.cardNumber.replace(/\s/g, "").length >= 13 &&
    cardForm.expiryDate.length === 5 &&
    cardForm.cvv.length >= 3 &&
    cardForm.cardholderName.trim().length > 0;

  const handleCompletePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (paymentMethod === "card") {
      // Here you would integrate with Razorpay or other payment gateway
      alert("Payment processed successfully! (Demo)");
    } else if (paymentMethod === "cash") {
      alert("Order confirmed! You can pay cash on delivery.");
    } else if (paymentMethod === "paypal") {
      // Here you would redirect to PayPal
      alert("Redirecting to PayPal... (Demo)");
    }

    setIsProcessing(false);
  };

  return (
    <main className="max-w-frame mx-auto px-4 xl:px-0">
      <h2
        className={cn([
          integralCF.className,
          "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
        ])}
      >
        Payment
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Display */}
              <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-4">
                {paymentMethod === "card" && <CreditCard className="h-5 w-5" />}
                {paymentMethod === "cash" && <Banknote className="h-5 w-5" />}
                {paymentMethod === "paypal" && (
                  <div className="h-5 w-5 rounded bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    P
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {paymentMethod === "card" && "Credit/Debit Card"}
                    {paymentMethod === "cash" && "Cash on Delivery"}
                    {paymentMethod === "paypal" && "PayPal"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod === "card" && "Secure card payment"}
                    {paymentMethod === "cash" && "Pay when your order arrives"}
                    {paymentMethod === "paypal" &&
                      "Pay with your PayPal account"}
                  </p>
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardForm.cardNumber}
                      onChange={handleCardInputChange("cardNumber")}
                      className="font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={cardForm.expiryDate}
                        onChange={handleCardInputChange("expiryDate")}
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardForm.cvv}
                        onChange={handleCardInputChange("cvv")}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={cardForm.cardholderName}
                      onChange={handleCardInputChange("cardholderName")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingCountry">Billing Country</Label>
                    <Select defaultValue="IN">
                      <SelectTrigger id="billingCountry">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN">India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Cash on Delivery */}
              {paymentMethod === "cash" && (
                <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
                  <div className="flex items-start gap-3">
                    <Banknote className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-200">
                        Cash on Delivery
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        You can pay in cash when your order is delivered to your
                        doorstep. Please keep the exact amount ready for a
                        smooth delivery experience.
                      </p>
                      <ul className="text-sm text-green-600 dark:text-green-400 mt-2 space-y-1">
                        <li>• No additional charges</li>
                        <li>• Pay only when you receive your order</li>
                        <li>• Cash or card payment to delivery partner</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal */}
              {paymentMethod === "paypal" && (
                <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                      P
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-200">
                        PayPal Payment
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        You'll be redirected to PayPal to complete your payment
                        securely. You can use your PayPal balance, bank account,
                        or linked cards.
                      </p>
                      <ul className="text-sm text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                        <li>• Secure PayPal checkout</li>
                        <li>• Buyer protection included</li>
                        <li>• Use PayPal balance or linked payment methods</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {mockOrderSummary.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.title} × {item.qty}
                    </span>
                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{mockOrderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{mockOrderSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>₹{mockOrderSummary.taxes.toFixed(2)}</span>
                </div>
                {mockOrderSummary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{mockOrderSummary.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{mockOrderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Payment Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleCompletePayment}
                disabled={
                  isProcessing || (paymentMethod === "card" && !isCardFormValid)
                }
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === "card" &&
                      `Pay ₹${mockOrderSummary.total.toFixed(2)}`}
                    {paymentMethod === "cash" && "Confirm Order"}
                    {paymentMethod === "paypal" && "Continue to PayPal"}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By completing this order, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
