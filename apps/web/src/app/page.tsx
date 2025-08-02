import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-semibold">İlan listesi gelecek 📋</h1>
      <Button>Yeni İlan Ekle</Button>
    </main>
  );
}
