"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const UserAuthNav = () => {
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after hydration
  if (!mounted) {
    return (
      <div className="p-1">
        <Image
          priority
          src="/icons/user.svg"
          height={100}
          width={100}
          alt="user"
          className="max-w-[22px] max-h-[22px]"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link href="/auth/signin" className="p-1">
        <Image
          priority
          src="/icons/user.svg"
          height={100}
          width={100}
          alt="user"
          className="max-w-[22px] max-h-[22px]"
        />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1 outline-none">
        <Image
          priority
          src="/icons/user.svg"
          height={100}
          width={100}
          alt="user"
          className="max-w-[22px] max-h-[22px]"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAuthNav;
