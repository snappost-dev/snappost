// apps/web/src/app/(public)/list/page.tsx

import ListingCard from "@/components/ui/ListingCard";
import { Listing, mockListings } from "@/mock/listings";


export default function ListingPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Tüm İlanlar</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockListings.map((listing: Listing) => (
  <ListingCard key={listing.id} {...listing} />
))}
      </div>
    </section>
  );
}
