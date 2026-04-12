"use client";

import { useState } from "react";
import { Cpu, Link, BarChart2, Globe, ChevronDown } from "lucide-react";

const TOPICS = [
  {
    icon: <Globe size={24} />,
    title: "Apa itu Bitcoin?",
    color: "text-warning",
    bg: "bg-warning/10",
    content: `Bitcoin adalah mata uang digital terdesentralisasi yang diciptakan pada tahun 2009 oleh seseorang (atau kelompok) dengan nama samaran Satoshi Nakamoto. Bitcoin memungkinkan transaksi peer-to-peer tanpa perantara seperti bank atau pemerintah.

Berbeda dengan uang konvensional, Bitcoin tidak dicetak oleh bank sentral. Sebaliknya, Bitcoin "ditambang" (mined) oleh komputer di seluruh dunia yang memvalidasi transaksi. Total supply Bitcoin dibatasi hanya 21 juta koin — inilah yang membuatnya langka.`,
  },
  {
    icon: <Link size={24} />,
    title: "Cara Kerja Blockchain",
    color: "text-info",
    bg: "bg-info/10",
    content: `Blockchain adalah buku besar digital yang transparan dan tidak bisa dimanipulasi. Setiap "blok" berisi sekumpulan transaksi, dan setiap blok terhubung ke blok sebelumnya — membentuk "rantai" (chain).

Ketika kamu mengirim Bitcoin, transaksi itu disiarkan ke ribuan node di seluruh dunia. Para miner bersaing memvalidasi transaksi dengan memecahkan teka-teki matematika kompleks. Setelah tervalidasi, transaksi masuk ke blok baru yang permanen dan tidak bisa diubah.`,
  },
  {
    icon: <BarChart2 size={24} />,
    title: "Kenapa Harga Naik Turun?",
    color: "text-success",
    bg: "bg-success/10",
    content: `Harga Bitcoin dipengaruhi oleh banyak faktor:

• **Supply & Demand**: Supply terbatas 21 juta, permintaan terus berubah
• **Halving**: Setiap ~4 tahun, reward mining berkurang 50% — mengurangi pasokan baru
• **Regulasi**: Kebijakan pemerintah di berbagai negara sangat berpengaruh
• **Sentimen Pasar**: Berita, tweet tokoh terkenal, atau tren makroekonomi
• **Adopsi Institusional**: Ketika perusahaan besar beli Bitcoin, harga cenderung naik`,
  },
  {
    icon: <Cpu size={24} />,
    title: "Mining & Halving",
    color: "text-secondary",
    bg: "bg-secondary/10",
    content: `Bitcoin mining adalah proses memvalidasi transaksi dengan menggunakan komputasi tinggi. Miner mendapatkan reward berupa Bitcoin baru sebagai imbalan.

Halving adalah event dimana reward mining dipotong 50%. Ini terjadi setiap 210.000 blok (~4 tahun). Halving terakhir terjadi April 2024, mengurangi reward dari 6.25 BTC menjadi 3.125 BTC per blok. Dengan berkurangnya pasokan baru, halving historis selalu diikuti kenaikan harga jangka panjang.`,
  },
];

export default function AboutBitcoin() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="tentang" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge badge-warning mb-4">📚 Edukasi Dasar</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Semua yang Perlu Kamu Tahu
          </h2>
          <p className="text-base-content/60 max-w-2xl mx-auto">
            Mulai dari nol — pelajari Bitcoin, blockchain, dan ekosistem kripto
            dengan penjelasan yang sederhana dan mudah dipahami.
          </p>
        </div>

        {/* Accordion topics */}
        <div className="max-w-3xl mx-auto space-y-3">
          {TOPICS.map((topic, i) => (
            <div
              key={i}
              className={`collapse collapse-arrow border border-base-300 rounded-2xl bg-base-100 transition-all duration-200 ${
                openIndex === i ? "shadow-lg border-warning/30" : ""
              }`}
            >
              <input
                type="radio"
                name="bitcoin-accordion"
                checked={openIndex === i}
                onChange={() => setOpenIndex(openIndex === i ? null : i)}
                className="peer"
                readOnly
              />
              <div
                className="collapse-title flex items-center gap-3 cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className={`p-2 rounded-xl ${topic.bg} ${topic.color}`}>
                  {topic.icon}
                </div>
                <span className="font-bold text-lg">{topic.title}</span>
              </div>
              <div className="collapse-content">
                <div className="pt-2 pb-4 text-base-content/80 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {topic.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blockchain visual explainer */}
        <div className="mt-20">
          <h3 className="text-center text-2xl font-bold mb-10">
            Visualisasi Blockchain
          </h3>
          <div className="flex flex-wrap justify-center gap-0 items-center">
            {["Genesis", "Block #1", "Block #2", "Block #3", "..."].map(
              (label, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`card border ${
                      i === 0
                        ? "border-warning bg-warning/10"
                        : "border-base-300 bg-base-200"
                    } p-3 sm:p-4 text-center min-w-[80px] sm:min-w-[100px] rounded-xl`}
                  >
                    <div className="text-2xl mb-1">{i === 0 ? "⛓️" : "📦"}</div>
                    <div className="text-xs font-bold">{label}</div>
                    {i < 4 && (
                      <div className="text-[10px] text-base-content/40 font-mono mt-1">
                        #{(Math.random() * 1e6) | 0}...
                      </div>
                    )}
                  </div>
                  {i < 4 && (
                    <div className="text-warning text-2xl mx-1 sm:mx-2 font-bold">
                      →
                    </div>
                  )}
                </div>
              )
            )}
          </div>
          <p className="text-center text-xs text-base-content/40 mt-4">
            Setiap blok menyimpan hash dari blok sebelumnya — tidak bisa dimanipulasi
          </p>
        </div>
      </div>
    </section>
  );
}
