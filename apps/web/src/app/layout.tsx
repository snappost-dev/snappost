// apps/web/src/app/layout.tsx

import "@/app/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Snappost",
  description: "İkinci el & sosyal ağ platformu",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
        {/* Header (Navbar dahil) */}
        <header>
          <Navbar />
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full p-4">{children}</main>

        <footer className="bg-gray-100 text-center p-4 text-sm text-gray-500">
          Snappost © {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
