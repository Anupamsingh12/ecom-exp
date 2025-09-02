"use client";

import type * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShippingFormData } from "@/types/checkout.types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ShippingForm({
  form,
  setForm,
}: {
  form: ShippingFormData;
  setForm: React.Dispatch<React.SetStateAction<ShippingFormData>>;
}) {
  const onChange =
    (key: keyof ShippingFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Shipping Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              autoComplete="name"
              value={form.fullName}
              onChange={onChange("fullName")}
              placeholder="Alex Johnson"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="alex@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={onChange("phone")}
              placeholder="+1 555 123 4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={form.country}
              onValueChange={(v) => setForm((f) => ({ ...f, country: v }))}
            >
              <SelectTrigger id="country" aria-label="Country">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="IN">India</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address1">Address line 1</Label>
          <Input
            id="address1"
            autoComplete="address-line1"
            value={form.address1}
            onChange={onChange("address1")}
            placeholder="123 Market St"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address2">Address line 2 (optional)</Label>
          <Input
            id="address2"
            autoComplete="address-line2"
            value={form.address2}
            onChange={onChange("address2")}
            placeholder="Apt, suite, unit, etc."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              autoComplete="address-level2"
              value={form.city}
              onChange={onChange("city")}
              placeholder="San Francisco"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              autoComplete="address-level1"
              value={form.state}
              onChange={onChange("state")}
              placeholder="CA"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal">Postal code</Label>
            <Input
              id="postal"
              autoComplete="postal-code"
              value={form.postalCode}
              onChange={onChange("postalCode")}
              placeholder="94105"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Order notes (optional)</Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Any special delivery instructions?"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
