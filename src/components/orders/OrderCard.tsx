"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import toast from "react-hot-toast";

type Order = {
  id: number;
  total_amount: string;
  status: string;
  payment_method: string;
  payment_status: string;
  createdAt: string;
  shipping_name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

type OrderCardProps = {
  data: Order;
  onCancel: (id: number) => Promise<void>;
  onTrack: (id: number) => void;
};

const OrderCard = ({ data, onCancel, onTrack }: OrderCardProps) => {
  const { isAuthenticated } = useAuth();

  const handleCancel = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to cancel an order");
      return;
    }
    try {
      await onCancel(data.id);
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Cancel failed:", error);
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="w-full border rounded-md bg-white p-4 mb-3">
      {/* Row 1: Order info */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base">Order #{data.id}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border">
            {data.status}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Row 2: Address + Price + Links */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="text-sm text-gray-700 max-w-md leading-snug">
          <span className="font-medium">Delivering to:</span>{" "}
          {data.address1}, {data.address2 && `${data.address2}, `}
          {data.city}, {data.state} - {data.postal_code}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <p className="font-semibold text-base">₹{data.total_amount}</p>
          <Link
            href={`/orders/${data.id}/track`}
            className="text-blue-600 hover:underline"
            onClick={() => onTrack(data.id)}
          >
            Track
          </Link>
          {data.status === "pending" && (
            <button
              onClick={handleCancel}
              className="text-red-600 hover:underline"
            >
              Cancel
            </button>
          )}
          <Link
            href={`/orders/${data.id}`}
            className="text-gray-600 hover:underline"
          >
            View Summary
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
