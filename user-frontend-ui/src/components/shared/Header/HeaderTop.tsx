"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { BsCart3 } from "react-icons/bs";

import { IoMdHeartEmpty } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import SearchInput from "../SearchInput";
import CSTooltip from "../CSTooltip";
import { useUser } from "@/context/user.provider";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function HeaderTop() {
  const { user, isUserLoading } = useUser();

  return (
    <section
      className={`bg-white w-full border-b border-gray-200 shadow-sm lg:shadow-none z-50 py-1.5`}
    >
      <div className="w-full relative">
        <div className="max-w-7xl mx-auto px-3 py-2 lg:py-5.5 flex justify-between items-center">
          {/* menubar for mobile */}
          <div className="lg:hidden">Menu</div>

          {/* logo */}
          <div className="text-2xl font-bold">
            <Link href="/">ClassyShop</Link>
          </div>

          {/* search bar */}
          <div className="hidden lg:block flex-1">
            <SearchInput />
          </div>

          {/* menu items */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* user profile link */}

                <div className="hidden lg:flex items-center gap-2.5">
                  <Link href="/profile">
                    <div className="p-2 border border-gray-300 rounded-full">
                      {user?.avatar ? (
                        <Image
                          className="rounded-full"
                          src={user?.avatar}
                          alt="avatar"
                        />
                      ) : (
                        <FaRegUser className="size-6 text-gray-700 hover:text-primary transition-colors duration-100" />
                      )}
                    </div>
                  </Link>
                  <Link href="/profile" className="text-sm font-medium">
                    <span className="block">Hello, </span>
                    <span className="block link">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* authentication link */}
                <div className="hidden lg:flex items-center gap-2.5">
                  <Link href="/login">
                    <div className="p-2 border border-gray-300 rounded-full">
                      <FaRegUser className="size-6 text-gray-700 hover:text-primary transition-colors duration-100" />
                    </div>
                  </Link>
                  <Link href="/login" className="text-sm font-medium">
                    <span className="block">Hello, </span>
                    <span className="block link">
                      {isUserLoading ? (
                        <Skeleton className="h-4 w-14" />
                      ) : (
                        "Sign in"
                      )}
                    </span>
                  </Link>
                </div>
              </>
            )}

            {/* divider */}
            <div className="hidden lg:block h-7.5 w-0.5 bg-gray-200"></div>

            {/* icons */}
            <ul className="flex items-center gap-3 md:gap-4 lg:gap-7.75">
              {/* search icon */}
              <li className="lg:hidden">
                <CSTooltip title="Wishlist">
                  <Link href="/wishlist" className="relative">
                    <IoMdHeartEmpty className="size-6.5 lg:size-7.5 text-gray-800 hover:text-primary transition-colors duration-100" />
                    <Badge className="absolute -top-2 -right-2 rounded-full px-1 lg:px-1.25 py-[0.5px] lg:py-px">
                      9
                    </Badge>
                  </Link>
                </CSTooltip>
              </li>
              {/* wishlist */}
              <li className="">
                <CSTooltip title="Wishlist">
                  <Link href="/wishlist" className="relative">
                    <IoMdHeartEmpty className="size-6.5 lg:size-7.5 text-gray-800 hover:text-primary transition-colors duration-100" />
                    <Badge className="absolute -top-2 -right-2 rounded-full px-1 lg:px-1.25 py-[0.5px] lg:py-px">
                      9
                    </Badge>
                  </Link>
                </CSTooltip>
              </li>
              {/* cart */}
              <li>
                <CSTooltip title="Cart">
                  <Link href="/cart" className="relative">
                    <BsCart3 className="size-6.5 lg:size-7.5 text-gray-800 hover:text-primary transition-colors duration-100" />
                    <Badge className="absolute -top-2 -right-2 rounded-full px-1 lg:px-1.25 py-[0.5px] lg:py-px">
                      9
                    </Badge>
                  </Link>
                </CSTooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
