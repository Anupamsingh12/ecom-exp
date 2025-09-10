"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ShippingAddress, ShippingAddressPayload } from "@/types/shippingAddress.types"
import { addShippingAddress } from "@/services/shipping-address"
import toast from "react-hot-toast"

interface AddAddressModalProps {
  isOpen: boolean
  onClose: (address?: ShippingAddressPayload) => void
  editingAddress?: ShippingAddress | null
}

export function AddAddressModal({ isOpen, onClose, editingAddress }: AddAddressModalProps) {
  const [form, setForm] = useState<ShippingAddressPayload>({
    name: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
  })

  useEffect(() => {
    if (editingAddress) {
      setForm({
        name: editingAddress.name,
        phone: editingAddress.phone,
        address1: editingAddress.address1,
        address2: editingAddress.address2 || "",
        city: editingAddress.city,
        state: editingAddress.state,
        postal_code: editingAddress.postal_code,
        country: editingAddress.country,
        is_default: editingAddress.is_default,
      })
    } else {
      // Reset form for new address
      setForm({
        name: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        is_default: false,
      })
    }
  }, [editingAddress, isOpen])

  const onChange = (key: keyof ShippingAddressPayload) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f: ShippingAddressPayload) => ({ ...f, [key]: e.target.value }))

  const isFormValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.address1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.postal_code.trim() &&
    form.country.trim()

  const handleSave = () => {
    if (!isFormValid) return
    onClose(form)
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={onChange("name")}
              placeholder="Full Name"
              required
            />
          </div>

            <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={onChange("phone")}
              placeholder="+91 XXXXX XXXXX"
              pattern="^(\+91[\-\s]?)?[6-9]\d{9}$"
              required
              maxLength={14}
              inputMode="tel"
            />
            </div>

          <div className="space-y-2">
            <Label htmlFor="address1">Address Line 1</Label>
            <Input
              id="address1"
              value={form.address1}
              onChange={onChange("address1")}
              placeholder="123 Market St"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2">Address Line 2 (optional)</Label>
            <Input
              id="address2"
              value={form.address2}
              onChange={onChange("address2")}
              placeholder="Apt, suite, unit, etc."
            />
          </div>

            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
              id="city"
              value={form.city}
              onChange={onChange("city")}
              placeholder="Bengaluru"
              required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input 
              id="state" 
              value={form.state} 
              onChange={onChange("state")} 
              placeholder="Karnataka" 
              required 
              />
            </div>
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={form.postal_code}
                onChange={onChange("postal_code")}
                placeholder="94105"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select 
                value={form.country} 
                onValueChange={(v) => setForm((f: ShippingAddressPayload) => ({ ...f, country: v }))}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="USA">United States</SelectItem>
                  {/* <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={form.is_default}
              onCheckedChange={(checked) => setForm((f: ShippingAddressPayload) => ({ ...f, is_default: checked === true }))}
            />
            <Label htmlFor="is_default" className="text-sm">
              Set as default address
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            {editingAddress ? "Update Address" : "Save Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
