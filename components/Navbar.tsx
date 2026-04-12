"use client";

import { useState, useEffect } from "react";
import { BookOpen, Palette, Menu, X } from "lucide-react";

const THEMES = [
  { id: "luxury", label: "Luxury", emoji: "✨" },
  { id: "dark", label: "Dark", emoji: "🌙" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "🤖" },
  { id: "synthwave", label: "Synthwave", emoji: "🎶" },
  { id: "halloween", label: "Halloween", emoji: "🎃" },
  { id: "forest", label: "Forest", emoji: "🌲" },
  { id: "aqua", label: "Aqua", emoji: "💧" },
  { id: "corporate", label: "Corporate", emoji: "💼" },
  { id: "cupcake", label: "Cupcake", emoji: "🧁" },
  { id: "dracula", label: "Dracula", emoji: "🧛" },
];

const NAV_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Apa itu Bitcoin?" },
  { href: "#harga", label: "Harga Live" },
  { href: "#kalkulator", label: "Kalkulator" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [theme, setTheme] = useState("luxury");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("learnnhub-theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeTheme = (t: string) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("learnnhub-theme", t);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-base-100/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#beranda" className="flex items-center gap-2 font-bold text-xl">
          <div className="p-1.5 rounded-lg bg-warning text-warning-content">
            <BookOpen size={20} />
          </div>
          <span className="text-base-content">
            Learn<span className="text-warning">Hub</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: theme switcher + hamburger */}
        <div className="flex items-center gap-2">
          {/* Theme dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-sm gap-1"
              title="Ganti Tema"
            >
              <Palette size={16} />
              <span className="hidden sm:inline text-xs">Tema</span>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content z-[100] menu p-2 shadow-xl bg-base-200 rounded-2xl w-52 mt-2 border border-base-300"
            >
              <p className="text-xs font-bold text-base-content/50 px-2 pb-1 uppercase tracking-widest">
                Pilih Tema
              </p>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => changeTheme(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors w-full text-left ${
                    theme === t.id
                      ? "bg-warning text-warning-content font-semibold"
                      : "hover:bg-base-300"
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                  {theme === t.id && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="btn btn-ghost btn-sm md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-base-100/95 backdrop-blur-md border-t border-base-200 px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-base-200 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
