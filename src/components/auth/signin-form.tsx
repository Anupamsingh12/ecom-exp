"use client";

import type React from "react";

import { useState } from "react";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { login } from "@/services/auth";
import { getCartItems } from "@/services/cart";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [, setCart] = useAtom(cartAtom);

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(formData);
      if (response.accessToken) {
        // set authentication state and store token with user data
        signIn(response.user, response.accessToken);

        // Fetch and update cart items
        try {
          const cartItems = await getCartItems();
          const formattedCartItems = cartItems?.map((item: any) => ({
            id: item.id,
            variantId: item.id,
            quantity: item.quantity,
            product_name: item.product_name,
            size: item.size,
            color: item.color,
            image: item.image,
            price: Number(item.price),
            sku: item.sku,
          }));
          setCart({ items: formattedCartItems });
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }

        // Redirect to the intended page after login
        const decodedUrl = decodeURIComponent(redirectUrl);
        toast.success("Logged in successfully");
        setTimeout(() => {
          router.push(decodedUrl);
        }, 100);
      }
    } catch (e: any) {
      console.error("Login error:", e);
      toast.error(e.message);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full shadow-lg border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 bg-background border-input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10 bg-background border-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
          >
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
