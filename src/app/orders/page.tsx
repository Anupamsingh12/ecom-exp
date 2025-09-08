"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/orders/OrderCard";
import { getAllOrder } from "@/services/orders";
import toast from "react-hot-toast";

type Order = {
  id: number;
  total_amount: string;
  user_id: number;
  status: string;
  payment_method: string;
  createdAt: string;
  payment_status: string;
  shipping_name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrder();
        setOrders(response); // adjust if API returns { data: [...] }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (id: number) => {
    try {
      // call your cancel API here
      console.log("Cancel order", id);
      toast.success(`Order #${id} cancelled successfully`);
      // refresh list after cancel
      const updated = await getAllOrder();
      setOrders(updated);
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Failed to cancel order");
    }
  };

  const handleTrack = (id: number) => {
    // Redirect or show tracking modal
    console.log("Track order", id);
    toast(`Tracking order #${id}`);
  };

  if (loading) {
    return <div className="p-6">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-6 text-gray-500">No orders found.</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          data={order}
          onCancel={handleCancel}
          onTrack={handleTrack}
        />
      ))}
    </div>
  );
}
