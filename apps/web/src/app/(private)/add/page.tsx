// apps/web/src/app/(private)/add/page.tsx

"use client";

import { useState } from "react";

export default function AddListingPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Yeni İlan Ekle</h1>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Başlık"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Açıklama"
          className="w-full p-2 border rounded"
          rows={4}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <input
          type="number"
          placeholder="Fiyat (₺)"
          className="w-full p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input type="file" onChange={handleImageChange} />

        {image && (
          <p className="text-sm text-gray-500">Seçilen dosya: {image.name}</p>
        )}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          disabled
        >
          Gönder (devre dışı)
        </button>
      </form>
    </section>
  );
}
