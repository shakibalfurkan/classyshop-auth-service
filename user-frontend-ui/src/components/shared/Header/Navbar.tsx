"use client";
import rocket from "@/assets/icons/rocket.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryMenu from "./CategoryMenu/CategoryMenu";
import { RiMenu2Fill } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { navItems } from "@/constant";
import Image from "next/image";
import { FaRegUser } from "react-icons/fa";
import CSTooltip from "../CSTooltip";
import { IoMdHeartEmpty } from "react-icons/io";
import { Badge } from "@/components/ui/badge";
import { BsCart3 } from "react-icons/bs";
import { useUser } from "@/context/user.provider";

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={
        "hidden w-full lg:flex items-center shadow-sm min-h-14 transition-transform duration-300 ease-in-out bg-white " +
        (isSticky ? "fixed top-0 left-0 " : "") +
        "z-40"
      }
    >
      <div className="max-w-7xl px-3 mx-auto w-full flex items-center justify-between">
        {/* category menu */}
        <div className="lg:min-w-52 mr-5 relative group/category">
          <button className="lg:flex items-center gap-2 cursor-pointer px-5 py-5 w-fit bg-primary text-white">
            <RiMenu2Fill className="text-xl mr-1" />
            <span className="uppercase font-medium text-sm hidden lg:block">
              All Categories
            </span>
            <MdKeyboardArrowDown className="ml-4 text-lg hidden lg:block" />
          </button>

          {/* dropdown */}
          <div className="absolute top-14 left-0 bg-white shadow-lg min-w-full opacity-0 translate-y-2 pointer-events-none group-hover/category:opacity-100 group-hover/category:translate-y-0 group-hover/category:pointer-events-auto transition-all duration-300 ease-out border-t-3 border-primary z-50 h-72">
            <CategoryMenu />
          </div>
        </div>

        {/* divider */}
        <div className="hidden lg:block h-7.5 w-0.5 bg-gray-200"></div>
        {/* nav links */}
        <div className="flex-1 px-3">
          <ul className="flex items-center gap-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="link px-3 py-3.5 font-medium">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {isSticky && (
          <div>
            {/* menu items */}
            <div className="flex items-center gap-4">
              {user && user.email ? (
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
                        {user.name.split(" ")[0]}
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
                      <span className="block link">Sign in </span>
                    </Link>
                  </div>
                </>
              )}

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
        )}
      </div>
    </section>
  );
}
