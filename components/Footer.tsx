import { BookOpen, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <div className="p-1.5 rounded-lg bg-warning text-warning-content">
                <BookOpen size={18} />
              </div>
              <span>
                Learn<span className="text-warning">Hub</span>
              </span>
            </div>
            <p className="text-sm text-base-content/60 leading-relaxed">
              Platform edukasi Bitcoin & Blockchain terlengkap dalam Bahasa
              Indonesia. Gratis, transparan, dan selalu diperbarui.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-base-content/50">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-base-content/70">
              {["Beranda", "Apa itu Bitcoin?", "Harga Live", "Kalkulator", "FAQ"].map(
                (l) => (
                  <li key={l}>
                    <a
                      href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                      className="hover:text-warning transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-base-content/50">
              Resource
            </h4>
            <ul className="space-y-2 text-sm text-base-content/70">
              {[
                { label: "Bitcoin Whitepaper", href: "https://bitcoin.org/bitcoin.pdf" },
                { label: "CoinGecko", href: "https://coingecko.com" },
                { label: "Blockchain Explorer", href: "https://mempool.space" },
                { label: "Indodax", href: "https://indodax.com" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-warning transition-colors"
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-base-300 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-base-content/40">
            © 2025 LearnHub. Dibuat untuk tujuan edukasi semata. Bukan saran investasi.
          </p>
          <div className="flex items-center gap-1 text-xs text-base-content/40">
            Built with Next.js 15 · DaisyUI · Three.js · ❤️
          </div>
        </div>
      </div>
    </footer>
  );
}
