// apps/web/src/components/ui/Navbar.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AuthDialog from "@/components/AuthDialog";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/list", label: "İlanlar" },
    { href: "/add", label: "Yeni İlan" },
    { href: "/chat/1", label: "Sohbet" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">
          Snappost
        </Link>

        {/* Masaüstü menü + Giriş butonu */}
        <div className="hidden md:flex space-x-4 items-center">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-700 hover:underline">
              {link.label}
            </Link>
          ))}
          <AuthDialog />
        </div>

        {/* Mobil menü butonu */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobil menü */}
      {open && (
        <div className="md:hidden px-4 pb-3 space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block text-gray-700">
              {link.label}
            </Link>
          ))}
          <AuthDialog />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
