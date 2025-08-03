// apps/web/src/components/AuthDialog.tsx

"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function AuthDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) {
      setStep("code");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Giriş Yap
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
            <Dialog.Title className="text-lg font-bold">
              {step === "phone" ? "Telefon Numaranız" : "Doğrulama Kodu"}
            </Dialog.Title>

            {step === "phone" ? (
              <>
                <input
                  type="tel"
                  placeholder="5xx xxx xx xx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <button
                  onClick={handlePhoneSubmit}
                  className="bg-black text-white w-full py-2 rounded"
                >
                  Kod Gönder
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border p-2 rounded tracking-widest text-center font-mono"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="bg-black text-white w-full py-2 rounded"
                >
                  Giriş Yap (Mock)
                </button>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
