// apps/web/mock/listings.ts

export type Listing = {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
};

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "iPhone 13 Pro",
    price: 24500,
    description: "Temiz kullanılmış, garantili. Takas düşünülmez.",
    imageUrl: "https://via.placeholder.com/600x400",
  },
  {
    id: "2",
    title: "Samsung TV 55''",
    price: 18500,
    description: "4K UHD. Kutulu, sıfır ayarında.",
    imageUrl: "https://via.placeholder.com/600x400",
  },
  {
    id: "3",
    title: "PlayStation 5",
    price: 19000,
    description: "Yanında 2 kol ve 3 oyun hediye.",
    imageUrl: "https://via.placeholder.com/600x400",
  },
];
