"use client";

import dynamic from "next/dynamic";
import { ArrowDown, Zap, Shield, TrendingUp } from "lucide-react";

const BitcoinGlobe = dynamic(() => import("./BitcoinGlobe"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="beranda"
      className="min-h-screen flex items-center pt-16 overflow-hidden relative"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 badge badge-warning badge-lg font-semibold">
              <Zap size={14} />
              Web3 Education Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Pahami{" "}
              <span className="text-warning relative">
                Bitcoin
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-warning/30 rounded-full" />
              </span>{" "}
              dari Nol sampai Pro
            </h1>

            <p className="text-base-content/70 text-lg max-w-lg mx-auto lg:mx-0">
              Platform edukasi blockchain & kripto terlengkap dalam Bahasa
              Indonesia. Dari konsep dasar hingga analisis harga real-time.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a href="#tentang" className="btn btn-warning btn-lg font-bold shadow-lg">
                Mulai Belajar
                <ArrowDown size={18} />
              </a>
              <a href="#harga" className="btn btn-outline btn-lg">
                Lihat Harga Live
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              {[
                { icon: <TrendingUp size={16} />, label: "Harga Live", value: "Real-time" },
                { icon: <Shield size={16} />, label: "Materi", value: "10+ Modul" },
                { icon: <Zap size={16} />, label: "Kalkulator", value: "BTC→IDR" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="text-warning">{s.icon}</div>
                  <div>
                    <div className="font-bold text-sm">{s.value}</div>
                    <div className="text-xs text-base-content/50">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Globe side */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-warning/5 rounded-full blur-3xl scale-75" />
            <BitcoinGlobe />
          </div>
        </div>
      </div>
    </section>
  );
}
