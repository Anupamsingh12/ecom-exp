"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export function GeneralSettingsForm() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [name, setName] = useState(user ? `${user.first_name} ${user.last_name}` : "");
  const [email, setEmail] = useState(user?.email || "");
  const [newsletter, setNewsletter] = useState(true);

  useEffect(() => {
    if (user) {
      setName(`${user.first_name} ${user.last_name}`);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Profile</CardTitle>
          <CardDescription>Basic information for your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="newsletter">Product newsletter</Label>
              <p className="text-xs text-muted-foreground">
                Get updates about launches and offers.
              </p>
            </div>
            <Switch
              id="newsletter"
              checked={newsletter}
              onCheckedChange={setNewsletter}
            />
          </div>
          <div className="flex gap-3">
            <Button type="button">Save changes</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new">New password</Label>
            <Input
              id="new"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
          </div>
          <Button type="button">Update password</Button>
          <Separator />
          <div className="grid gap-2">
            <Label htmlFor="address">Default shipping address</Label>
            <Input
              id="address"
              placeholder="123 Main St, City, Country"
              autoComplete="street-address"
            />
          </div>
          <Button type="button" variant="outline">
            Save address
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
