"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, PlusIcon, PencilIcon } from "lucide-react";
import { AddAddressModal } from "./AddAddressModal";
import { getShippingAddress, addShippingAddress, updateShippingAddress } from "@/services/shipping-address";
import { ShippingAddress, ShippingAddressPayload } from "@/types/shippingAddress.types";

type Address = ShippingAddress;

interface ShippingAddressSectionProps {
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
}

export function ShippingAddressSection({ 
  selectedAddressId,
  setSelectedAddressId 
}: ShippingAddressSectionProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await getShippingAddress();
        if (response?.rows) {
          setAddresses(response.rows);
          // Set selected address to default one or first one
          const defaultAddress = response.rows.find((addr) => addr.is_default);
          setSelectedAddressId(defaultAddress?.id || response.rows[0]?.id || null);
        }
      } catch (error) {
        console.error('Error fetching shipping addresses:', error);
      }
    }
    fetchAddresses();
  }, []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  const formatAddress = (address: Address) => {
    const parts = [
      address.address1,
      address.address2,
      `${address.city}, ${address.state} ${address.postal_code}`,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const fetchAddresses = async () => {
    try {
      const response = await getShippingAddress();
      if (response?.rows) {
        setAddresses(response.rows);
        const defaultAddress = response.rows.find((addr) => addr.is_default);
        setSelectedAddressId(defaultAddress?.id || response.rows[0]?.id || null);
      }
    } catch (error) {
      console.error('Error fetching shipping addresses:', error);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleAddAddress = async (addressData: ShippingAddressPayload) => {
    try {
      await addShippingAddress(addressData);
      fetchAddresses(); // Refresh the list
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleUpdateAddress = async (addressData: ShippingAddressPayload) => {
    if (!editingAddress) return;
    
    try {
      await updateShippingAddress(String(editingAddress.id), addressData);
      fetchAddresses(); // Refresh the list
      setIsEditModalOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleCloseEditModal = (addressData?: ShippingAddressPayload) => {
    if (addressData && editingAddress) {
      handleUpdateAddress(addressData);
    }
    setIsEditModalOpen(false);
    setEditingAddress(null);
  };

  const handleCloseAddModal = (addressData?: ShippingAddressPayload) => {
    if (addressData) {
      handleAddAddress(addressData);
    } else {
      setIsAddModalOpen(false);
    }
  };

  if (!selectedAddress && addresses.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPinIcon className="size-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              No shipping addresses found
            </p>
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <PlusIcon className="size-4" />
              Add New Address
            </Button>
          </div>
          <AddAddressModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPinIcon className="size-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isExpanded && selectedAddress ? (
            <div className="flex items-start justify-between gap-4 rounded-lg border bg-muted/50 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Delivering to</p>
                  {selectedAddress.is_default && (
                    <Badge variant="outline" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium">{selectedAddress.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatAddress(selectedAddress)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(true)}
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Select shipping address:</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  Collapse
                </Button>
              </div>

              <div className="space-y-2">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                      selectedAddressId === address.id
                        ? "ring-2 ring-primary bg-muted/50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping-address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{address.name}</p>
                          {address.is_default && (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatAddress(address)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditAddress(address);
                      }}
                      className="gap-1 text-xs"
                    >
                      <PencilIcon className="size-3" />
                      Edit
                    </Button>
                  </label>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full gap-2"
              >
                <PlusIcon className="size-4" />
                Add New Address
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
      />

      <AddAddressModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editingAddress={editingAddress}
      />
    </>
  );
}
