"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { getSingleOrderDetails } from "@/services/orders";
import { emptyCart } from "@/services/cart";

// Types
type OrderItem = {
  order_item_id: number;
  item_id: number;
  quantity: number;
  price: string;
  image: string[];
  size: string;
  name: string;
  description: string;
};

type ShippingAddress = {
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

type Order = {
  id: number;
  total_amount: string;
  status: string;
  payment_method: string;
  payment_status: string;
  createdAt: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
};

// Helper: status colors
const statusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);

  // ✅ Show toast if payment gateway redirected with success
  useEffect(() => {
    const type = searchParams.get("type");
    if(type){
      if (type === "success") {
        toast.success("Payment successful! Your order has been placed.");
      }
      if (type === "cod_success") {
        toast.success("Thanks for shopping! Your order has been placed.");
      }
      emptyCart();
    }
  }, [searchParams]);

  // ✅ Fetch order details
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const response: any  = await getSingleOrderDetails(Number(id));
        setOrder(response);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Failed to load order details");
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <div className="p-6">Loading order details...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Order #{order.id}</CardTitle>
            <CardDescription>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge className={statusColor(order.status)}>{order.status}</Badge>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <span className="font-medium">Payment:</span>{" "}
            {order.payment_method} ({order.payment_status})
          </p>
          <p className="font-semibold text-lg">
            Total: ₹{order.total_amount}
          </p>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card>
        <CardHeader>
          <CardTitle>Delivering To</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          <p>
            {order.shipping_address.address1}
            {order.shipping_address.address2
              ? `, ${order.shipping_address.address2}`
              : ""}
          </p>
          <p>
            {order.shipping_address.city}, {order.shipping_address.state} -{" "}
            {order.shipping_address.postal_code}
          </p>
          <p>{order.shipping_address.country}</p>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.order_item_id}
              className="flex gap-4 border rounded-md p-3"
            >
              <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-600 text-xs line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-600 text-xs">
                    Size: {item.size} | Qty: {item.quantity}
                  </p>
                  <p className="font-semibold">₹{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-6">
        <Link
          href={`/orders/${order.id}/track`}
          className="text-blue-600 hover:underline text-sm"
        >
          Track Order
        </Link>
        {order.status === "pending" && (
          <Link
            href={`/orders/${order.id}/cancel`}
            className="text-red-600 hover:underline text-sm"
          >
            Cancel Order
          </Link>
        )}
      </div>
    </div>
  );
}
