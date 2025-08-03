// apps/web/src/components/ui/ListingCard.tsx

"use client"; // ✅ Bu satırı en üste ekle

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const MotionDiv = motion("div");

type ListingCardProps = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};

const ListingCard = ({ id, title, price, imageUrl }: ListingCardProps) => {
  return (
    <MotionDiv
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/ad/${id}`}
        className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition block"
      >
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-3">
          <h2 className="text-lg font-semibold truncate">{title}</h2>
          <p className="text-primary text-sm mt-1">{price} ₺</p>
        </div>
      </Link>
    </MotionDiv>
  );
};

export default ListingCard;
