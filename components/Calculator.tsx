"use client";

import { useState } from "react";
import { ArrowLeftRight, Calculator } from "lucide-react";

const MOCK_BTC_IDR = 83420 * 16250;
const IDR_RATE = 16250;

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

const QUICK_AMOUNTS_BTC = [0.001, 0.01, 0.1, 0.5, 1, 5];
const QUICK_AMOUNTS_IDR = [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000];

export default function Calculator_() {
  const [btc, setBtc] = useState("");
  const [idr, setIdr] = useState("");
  const [mode, setMode] = useState<"btc" | "idr">("btc"); // which field is being edited

  const handleBtcChange = (val: string) => {
    setBtc(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setIdr((num * MOCK_BTC_IDR).toFixed(0));
    } else {
      setIdr("");
    }
    setMode("btc");
  };

  const handleIdrChange = (val: string) => {
    setIdr(val);
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    if (!isNaN(num)) {
      setBtc((num / MOCK_BTC_IDR).toFixed(8));
    } else {
      setBtc("");
    }
    setMode("idr");
  };

  const setQuickBtc = (amount: number) => {
    handleBtcChange(amount.toString());
  };

  const setQuickIdr = (amount: number) => {
    handleIdrChange(amount.toString());
  };

  return (
    <section id="kalkulator" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge badge-warning mb-4">⚡ Kalkulator</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Konversi BTC ↔ Rupiah
          </h2>
          <p className="text-base-content/60">
            Hitung berapa nilai Bitcoin kamu dalam Rupiah — atau sebaliknya
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="card bg-base-100 border border-base-300 rounded-3xl p-6 sm:p-8 shadow-sm">
            {/* Rate info */}
            <div className="flex items-center justify-between mb-6 bg-warning/10 rounded-2xl px-4 py-3">
              <span className="text-sm text-base-content/60">1 BTC =</span>
              <span className="font-black text-warning text-lg">
                {formatIDR(MOCK_BTC_IDR)}
              </span>
            </div>

            {/* BTC input */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <span className="text-xl">₿</span> Bitcoin (BTC)
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={btc}
                  onChange={(e) => handleBtcChange(e.target.value)}
                  placeholder="0.00000000"
                  className="input input-bordered w-full pr-16 font-mono text-lg focus:input-warning"
                  step="0.00000001"
                  min="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 font-bold text-sm">
                  BTC
                </span>
              </div>
              {/* Quick amounts */}
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_AMOUNTS_BTC.map((a) => (
                  <button
                    key={a}
                    onClick={() => setQuickBtc(a)}
                    className="btn btn-xs btn-ghost border border-base-300"
                  >
                    {a} BTC
                  </button>
                ))}
              </div>
            </div>

            {/* Swap icon */}
            <div className="flex justify-center my-2">
              <div className="btn btn-circle btn-ghost btn-sm text-warning border border-warning/30">
                <ArrowLeftRight size={16} />
              </div>
            </div>

            {/* IDR input */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <span className="text-xl">🇮🇩</span> Rupiah (IDR)
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={idr}
                  onChange={(e) => handleIdrChange(e.target.value)}
                  placeholder="0"
                  className="input input-bordered w-full pr-16 font-mono text-lg focus:input-warning"
                  step="1000"
                  min="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 font-bold text-sm">
                  IDR
                </span>
              </div>
              {/* Quick amounts */}
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_AMOUNTS_IDR.map((a) => (
                  <button
                    key={a}
                    onClick={() => setQuickIdr(a)}
                    className="btn btn-xs btn-ghost border border-base-300"
                  >
                    {(a / 1_000_000).toFixed(a >= 1_000_000 ? 0 : 1)}jt
                  </button>
                ))}
              </div>
            </div>

            {/* Result display */}
            {btc && idr && (
              <div className="bg-success/10 border border-success/20 rounded-2xl p-4 text-center">
                <div className="text-sm text-base-content/60 mb-1">Hasil Konversi</div>
                {mode === "btc" ? (
                  <div>
                    <span className="font-bold text-warning">{btc} BTC</span>
                    <span className="text-base-content/40 mx-2">=</span>
                    <span className="font-bold text-success">
                      {formatIDR(parseFloat(idr))}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-success">
                      {formatIDR(parseFloat(idr))}
                    </span>
                    <span className="text-base-content/40 mx-2">=</span>
                    <span className="font-bold text-warning">{btc} BTC</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-base-content/30 mt-4">
            * Harga bersifat simulasi. Untuk trading, gunakan platform terpercaya seperti Indodax atau Tokocrypto.
          </p>
        </div>
      </div>
    </section>
  );
}
