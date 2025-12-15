"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsCart3 } from "react-icons/bs";

import { IoIosGitCompare, IoMdHeartEmpty } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import SearchInput from "../SearchInput";
import CSTooltip from "../CSTooltip";

export default function HeaderTop() {
  const [showSearchBar, setShowSearchBar] = useState(false);

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
            {/* authentication link */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link href="/login">
                <div className="p-2 border border-gray-300 rounded-full">
                  <FaRegUser className="size-6 text-gray-700 hover:text-primary transition-colors duration-100" />
                </div>
              </Link>
              <Link href="/login" className="text-sm font-medium">
                <span className="block">Hello, </span>
                <span className="block link">Sign in </span>
              </Link>
            </div>

            {/* divider */}
            <div className="hidden lg:block h-7.5 w-0.5 bg-gray-200"></div>

            {/* icons */}
            <ul className="flex items-center gap-2.5 md:gap-4 lg:gap-7.75">
              {/* wishlist */}
              <li className="hidden lg:block">
                <CSTooltip title="Wishlist">
                  <Link href="/wishlist" className="relative">
                    <IoMdHeartEmpty className="size-6 lg:size-7.5 text-gray-800 hover:text-primary transition-colors duration-100" />
                    <Badge className="absolute -top-2 -right-2 rounded-full px-1.25 py-px">
                      9
                    </Badge>
                  </Link>
                </CSTooltip>
              </li>
              {/* search button */}
              <li
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="lg:hidden"
              >
                <IoSearch
                  className={`size-6 text-gray-800 hover:text-primary transition-colors duration-100 ${
                    showSearchBar && "text-primary"
                  }`}
                />
              </li>
              {/* cart */}
              <li>
                <CSTooltip title="Cart">
                  <Link href="/cart" className="relative">
                    <BsCart3 className="size-6 lg:size-7.5 text-gray-800 hover:text-primary transition-colors duration-100" />
                    <Badge className="absolute -top-2 -right-2 rounded-full px-1.25 py-px">
                      9
                    </Badge>
                  </Link>
                </CSTooltip>
              </li>
            </ul>
          </div>
        </div>
        {showSearchBar && (
          <div className="bg-white shadow-sm lg:hidden border-t border-gray-200 py-2 px-3 w-full absolute top-full left-0 z-9999">
            <SearchInput />
          </div>
        )}
      </div>
    </section>
  );
}
