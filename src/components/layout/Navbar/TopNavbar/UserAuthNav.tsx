"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { ChevronDown, LogOut } from "lucide-react";

const UserAuthNav = () => {
  const router = useRouter();
  
  const { isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link href="/auth/signin">
        <FaRegUserCircle size={22} />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-1 p-1 cursor-pointer">
          <FaUserCircle size={22} />
          <ChevronDown size={18} />
        </div>
        {/* <Image
          priority
          src="/icons/user.svg"
          height={100}
          width={100}
          alt="user"
          className="max-w-[22px] max-h-[22px]"
        /> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:!bg-red-500 hover:!text-white"
          onClick={() => signOut()}
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAuthNav;
