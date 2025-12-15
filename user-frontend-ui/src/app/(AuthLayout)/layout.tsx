import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ClassyShop",
  description: "Welcome to ClassyShop. Your one stop shop for all things.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-3 py-5">
        <Link href="/" className="hover:cursor-pointer text-2xl font-semibold">
          ClassyShop
        </Link>
      </div>
      <section>{children}</section>
    </section>
  );
}
