"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Apakah Bitcoin legal di Indonesia?",
    a: "Bitcoin tidak diakui sebagai alat pembayaran sah di Indonesia berdasarkan regulasi Bank Indonesia. Namun, Bitcoin diakui sebagai komoditas dan boleh diperdagangkan di platform yang terdaftar di Bappebti (Badan Pengawas Perdagangan Berjangka Komoditi). Jadi, kamu boleh beli, jual, dan investasi Bitcoin melalui exchange resmi.",
  },
  {
    q: "Berapa minimal beli Bitcoin?",
    a: "Di exchange Indonesia seperti Indodax atau Tokocrypto, kamu bisa mulai membeli Bitcoin dengan nominal sangat kecil, bahkan mulai dari Rp 50.000 saja. Kamu tidak perlu membeli 1 Bitcoin penuh — bisa membeli satuan yang lebih kecil disebut Satoshi (1 BTC = 100 juta Satoshi).",
  },
  {
    q: "Apakah Bitcoin aman?",
    a: "Teknologi blockchain Bitcoin sendiri sangat aman karena terdesentralisasi dan menggunakan kriptografi canggih. Risiko terbesar biasanya bukan dari Bitcoin-nya, melainkan dari: exchange yang tidak aman, phishing/hacking, kehilangan private key, atau scam. Gunakan exchange terpercaya, aktifkan 2FA, dan simpan aset di wallet sendiri untuk keamanan optimal.",
  },
  {
    q: "Apa itu Bitcoin Halving dan kenapa penting?",
    a: "Halving adalah event dimana reward untuk miner Bitcoin dipotong 50% setiap ~4 tahun (tepatnya setiap 210.000 blok). Ini membuat pasokan Bitcoin baru makin berkurang. Halving April 2024 mengurangi reward dari 6.25 BTC menjadi 3.125 BTC/blok. Secara historis, setiap halving selalu diikuti bull run besar dalam 12-18 bulan setelahnya.",
  },
  {
    q: "Apa bedanya Bitcoin dengan altcoin?",
    a: "Bitcoin (BTC) adalah kripto pertama dan paling terdesentralisasi — sering disebut 'digital gold'. Altcoin adalah semua kripto selain Bitcoin (Ethereum, BNB, Solana, dll). Bitcoin punya supply paling terbatas dan keamanan paling teruji. Altcoin biasanya menawarkan fitur tambahan seperti smart contract (Ethereum) atau transaksi lebih cepat, tapi umumnya lebih volatile dan berisiko.",
  },
  {
    q: "Bagaimana cara menyimpan Bitcoin dengan aman?",
    a: "Ada beberapa cara: (1) Hot Wallet — di exchange atau aplikasi mobile, mudah diakses tapi rentan hack; (2) Software Wallet — aplikasi desktop/mobile seperti Electrum atau Trust Wallet, lebih aman; (3) Hardware Wallet — perangkat fisik seperti Ledger atau Trezor, paling aman untuk jangka panjang; (4) Paper Wallet — cetak private key di kertas, sangat aman tapi risiko hilang/rusak. Prinsip utama: 'Not your keys, not your coins'.",
  },
  {
    q: "Bisakah Bitcoin menjadi Rp 0?",
    a: "Secara teori sangat tidak mungkin karena: (1) jaringan Bitcoin sangat terdesentralisasi — tidak ada entitas tunggal yang bisa 'mematikan' Bitcoin; (2) selalu ada demand dari seluruh dunia; (3) sudah ada infrastruktur ekosistem yang besar. Namun seperti semua aset, harga bisa turun drastis karena regulasi global yang ketat, quantum computing, atau krisis kepercayaan. Selalu investasi sesuai kemampuan dan siap kehilangan.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 bg-base-200/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="badge badge-warning mb-4">❓ FAQ</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Pertanyaan yang Sering Ditanya
          </h2>
          <p className="text-base-content/60 max-w-xl mx-auto">
            Temukan jawaban atas pertanyaan paling umum tentang Bitcoin dan kripto
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                open === i
                  ? "bg-base-100 border-warning/30 shadow-md"
                  : "bg-base-100 border-base-300"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
              >
                <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
                <span
                  className={`text-warning text-xl flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-base-content/70 text-sm sm:text-base leading-relaxed border-t border-base-200 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
