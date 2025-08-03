// apps/web/src/app/(private)/chat/[threadId]/page.tsx

"use client";

type Message = {
  id: string;
  sender: "me" | "other";
  text: string;
};

const mockMessages: Message[] = [
  { id: "1", sender: "other", text: "Merhaba, ürün hâlâ satılık mı?" },
  { id: "2", sender: "me", text: "Evet, hâlâ duruyor." },
  { id: "3", sender: "other", text: "Fiyatta pazarlık olur mu?" },
  { id: "4", sender: "me", text: "Çok az olur belki. Nerede oturuyorsunuz?" },
];

export default function ChatPage() {
  return (
    <section className="max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Sohbet</h1>

      <div className="border rounded p-4 space-y-2 bg-white shadow">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-3 py-2 rounded text-sm ${
              msg.sender === "me"
                ? "bg-blue-100 self-end ml-auto"
                : "bg-gray-100 self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Mesaj yaz..."
          className="flex-1 border p-2 rounded"
          disabled
        />
        <button
          className="bg-black text-white px-4 py-2 rounded"
          disabled
        >
          Gönder
        </button>
      </div>
    </section>
  );
}
