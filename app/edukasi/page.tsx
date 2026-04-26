"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchModules, type Module } from "../lib/supabase-data";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase";

const FREE_MODULE_INDICES = [0, 1]; // first 2 modules are free

export default function EdukasiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    fetchModules().then((data) => { setModules(data); setModulesLoading(false); });
  }, []);

  useEffect(() => {
    if (!user) { setProgressLoading(false); return; }
    const supabase = createClient();
    supabase
      .from("module_progress")
      .select("module_id, lesson_idx, completed")
      .eq("user_id", user.id)
      .eq("completed", true)
      .then(({ data }) => {
        if (data) {
          const map: Record<number, number> = {};
          data.forEach((r) => { map[r.module_id] = (map[r.module_id] || 0) + 1; });
          setProgressMap(map);
        }
        setProgressLoading(false);
      });
  }, [user]);

  const modulesCompleted = modules.filter((m) => (progressMap[m.id] || 0) >= m.lessons.length).length;
  const totalLessonsCompleted = Object.values(progressMap).reduce((a, b) => a + b, 0);
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);

  const handleModuleClick = (module: Module, idx: number) => {
    const isFree = FREE_MODULE_INDICES.includes(idx);
    if (!isFree && !user) { router.push("/register"); return; }
    router.push(`/edukasi/${module.id}`);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>
        <div style={{ padding: "52px 20px 44px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "color-mix(in srgb, #a78bfa 4%, transparent)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, marginBottom: 18, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>
            🎓 {modulesLoading ? "..." : modules.length} Modul Belajar
          </div>
          <h1 className="font-black" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: "var(--text-main,#e8eaf0)", marginBottom: 10, lineHeight: 1.1 }}>
            Modul <span style={{ color: "#a78bfa" }}>Edukasi</span> Bitcoin
          </h1>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.45, maxWidth: 440, margin: "0 auto 28px", fontSize: 14 }}>
            Dari nol hingga mahir. 2 modul pertama gratis, modul lanjutan perlu akun.
          </p>

          {!loading && !user && (
            <div style={{ maxWidth: 440, margin: "0 auto", padding: "14px 20px", borderRadius: 12, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.22)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.7 }}>🔒 Daftar gratis untuk unlock semua modul</span>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href="/register" style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "#a78bfa", color: "#000", textDecoration: "none" }}>Daftar Gratis</Link>
                <Link href="/login" style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "var(--text-main,#e8eaf0)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>Masuk</Link>
              </div>
            </div>
          )}

          {user && !progressLoading && modules.length > 0 && (
            <div style={{ maxWidth: 440, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.5 }}>Progress kamu</span>
                <span className="font-mono-styled" style={{ color: "#a78bfa", fontWeight: 700 }}>{modulesCompleted}/{modules.length} Modul Selesai</span>
              </div>
              <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, width: `${(modulesCompleted / modules.length) * 100}%`, background: "linear-gradient(to right, #8b5cf6, #06b6d4)", boxShadow: "0 0 10px rgba(139,92,246,0.5)", transition: "width 1s ease" }} />
              </div>
              <p style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.35, marginTop: 8 }}>{totalLessonsCompleted} dari {totalLessons} pelajaran selesai</p>
            </div>
          )}
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 20px 80px" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
            {[
              { v: modulesLoading ? "..." : `${modules.length}`, l: "Modul", icon: "📚" },
              { v: modulesLoading ? "..." : `${totalLessons}`, l: "Pelajaran", icon: "📖" },
              { v: "2", l: "Modul Gratis", icon: "🎁" },
            ].map((s) => (
              <div key={s.l} className="grad-border" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, flex: "1 1 120px" }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div className="font-mono-styled" style={{ fontSize: 18, fontWeight: 900, color: "#a78bfa" }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.4 }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>

          {modulesLoading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(167,139,250,0.15)", borderTop: "2px solid #a78bfa", margin: "0 auto 14px", animation: "spin 0.7s linear infinite" }} />
              <p style={{ opacity: 0.3, fontSize: 13, color: "var(--text-main,#e8eaf0)" }}>Memuat modul...</p>
            </div>
          ) : modules.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", maxWidth: 440, margin: "0 auto" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>Belum Ada Modul</h3>
              <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.45, lineHeight: 1.7 }}>
                Admin belum menambahkan modul. Silakan login sebagai admin dan buat modul di panel admin.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
              {modules.map((m, idx) => {
                const isFree = FREE_MODULE_INDICES.includes(idx);
                const isLocked = !isFree && !user;
                const doneCount = progressMap[m.id] || 0;
                const moduleDone = m.lessons.length > 0 && doneCount >= m.lessons.length;
                const pct = m.lessons.length > 0 ? Math.round((doneCount / m.lessons.length) * 100) : 0;

                return (
                  <div key={m.id} onClick={() => handleModuleClick(m, idx)} style={{ cursor: "pointer", position: "relative" }}>
                    <div className="grad-border p-5" style={{ transition: "transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s", height: "100%", opacity: isLocked ? 0.65 : 1 }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 18px 44px rgba(0,0,0,0.28), 0 0 0 1px ${isLocked ? "#a78bfa25" : m.accent + "25"}`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                      {isLocked && (
                        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", fontSize: 10, fontWeight: 700, color: "#a78bfa" }}>
                          🔒 Login dulu
                        </div>
                      )}
                      {isFree && (
                        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", fontSize: 10, fontWeight: 700, color: "#22c55e" }}>
                          🆓 Gratis
                        </div>
                      )}

                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 13, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", background: isLocked ? "rgba(167,139,250,0.1)" : moduleDone ? "rgba(34,197,94,0.12)" : `color-mix(in srgb, ${m.accent} 12%, transparent)`, border: `1px solid ${isLocked ? "rgba(167,139,250,0.2)" : moduleDone ? "rgba(34,197,94,0.25)" : m.accent + "30"}` }}>
                          {isLocked ? "🔒" : moduleDone ? "✅" : m.icon}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: `color-mix(in srgb, ${m.levelColor} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${m.levelColor} 30%, transparent)`, color: m.levelColor, marginTop: 28 }}>{m.level}</span>
                      </div>

                      <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-main,#e8eaf0)", marginBottom: 7, lineHeight: 1.3 }}>{m.title}</h3>
                      <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.42, lineHeight: 1.6, marginBottom: 12 }}>{m.desc}</p>

                      <div className="font-mono-styled" style={{ display: "flex", gap: 14, fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.3, marginBottom: 14 }}>
                        <span>⏱ {m.dur}</span>
                        <span>📚 {m.lessons.length} pelajaran</span>
                      </div>

                      {user && !isLocked && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 5 }}>
                            <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4 }}>Progress</span>
                            <span className="font-mono-styled" style={{ color: m.accent, fontWeight: 700 }}>{doneCount}/{m.lessons.length}</span>
                          </div>
                          <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: `linear-gradient(to right, ${m.accent}, #06b6d4)`, transition: "width 0.8s ease" }} />
                          </div>
                        </div>
                      )}

                      <div style={{ padding: "9px 0", borderRadius: 9, textAlign: "center", fontSize: 12, fontWeight: 700, background: isLocked ? "rgba(167,139,250,0.1)" : moduleDone ? "rgba(34,197,94,0.08)" : `color-mix(in srgb, ${m.accent} 10%, transparent)`, border: `1px solid ${isLocked ? "rgba(167,139,250,0.25)" : moduleDone ? "rgba(34,197,94,0.25)" : m.accent + "30"}`, color: isLocked ? "#a78bfa" : moduleDone ? "#22c55e" : m.accent }}>
                        {isLocked ? "🔒 Daftar untuk Unlock" : moduleDone ? "✓ Selesai — Ulangi" : doneCount > 0 ? `Lanjutkan (${pct}%)` : "Mulai Belajar →"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
