// apps/web/src/app/(public)/ad/[id]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { Listing, mockListings } from "@/mock/listings";

type Params = {
  params: { id: string };
};

export default function AdDetailPage({ params }: Params) {
  const listing = mockListings.find((item: Listing) => item.id === params.id);

  if (!listing) return notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">{listing.title}</h1>

      <div className="relative w-full h-64">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover rounded"
        />
      </div>

      <p className="text-primary text-lg">{listing.price} ₺</p>
      <p className="text-gray-700">{listing.description}</p>
    </section>
  );
}
