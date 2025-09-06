"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/types/payment.types";

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}

export function PaymentMethodSection({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodSectionProps) {
  const paymentOptions = [
    {
      id: "card",
      label: "Credit/Debit Card",
      description: "Pay securely with your card",
      icon: CreditCard,
    },
    {
      id: "cash",
      label: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: Banknote,
    },
    {
      id: "paypal",
      label: "PayPal",
      description: "Pay with your PayPal account",
      icon: Wallet,
    },
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
          className="grid grid-cols-1 gap-3"
        >
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Label
                key={option.id}
                htmlFor={`payment-${option.id}`}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50",
                  paymentMethod === option.id &&
                    "ring-2 ring-primary bg-muted/30"
                )}
              >
                <RadioGroupItem id={`payment-${option.id}`} value={option.id} />
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
