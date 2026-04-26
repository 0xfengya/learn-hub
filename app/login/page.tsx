"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    setLoading(true);
    const supabase = createClient();
    const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      if (authError.message.includes("Invalid login")) setError("Email atau password salah.");
      else if (authError.message.includes("Email not confirmed")) setError("Cek email kamu untuk konfirmasi akun.");
      else setError(authError.message);
      return;
    }
    if (signInData.user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", signInData.user.id).single();
      router.push(profile?.role === "admin" ? "/admin" : "/edukasi");
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/edukasi` },
    });
  };

  const A = "#f59e0b";

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#080910", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-12px) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
        @keyframes pulse { 0%,100% { opacity:.15 } 50% { opacity:.28 } }
        .inp-wrap { display:flex; align-items:center; background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.09); border-radius:12px; transition:border .2s,background .2s; }
        .inp-wrap:focus-within { border-color:${A}60; background:rgba(245,158,11,0.04); }
        .inp-wrap input { flex:1; background:transparent; border:none; padding:13px 14px; font-size:14px; color:#e8eaf0; outline:none; }
        .inp-wrap input::placeholder { opacity:.3; }
        .inp-icon { padding:0 14px; font-size:15px; opacity:.3; flex-shrink:0; }
        * { box-sizing:border-box; }
      `}</style>

      {/* Background blobs */}
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, ${A}12 0%, transparent 65%)`, top:-100, right:-100, pointerEvents:"none", animation:"pulse 4s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%)", bottom:100, left:-50, pointerEvents:"none" }} />

      {/* Left panel */}
      <div style={{ flex:"0 0 480px", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 52px", borderRight:"1px solid rgba(255,255,255,0.05)", position:"relative" }} className="hidden lg:flex">
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:52 }}>
          <div style={{ width:44, height:44, borderRadius:13, background:`linear-gradient(135deg, ${A}, #f97316)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:18, color:"#000", boxShadow:`0 8px 24px ${A}40` }}>LH</div>
          <div>
            <div style={{ fontWeight:900, fontSize:20, color:"#e8eaf0", letterSpacing:"-0.3px" }}>Learn<span style={{ color:A }}>Hub</span></div>
            <div style={{ fontSize:10, opacity:.3, letterSpacing:"0.14em", color:"#e8eaf0", fontFamily:"monospace" }}>BITCOIN ACADEMY</div>
          </div>
        </div>

        <h2 style={{ fontSize:"2.6rem", fontWeight:900, color:"#e8eaf0", lineHeight:1.1, marginBottom:16, letterSpacing:"-1px" }}>
          Belajar Bitcoin<br /><span style={{ color:A }}>dari Nol</span><br />ke Mahir
        </h2>
        <p style={{ fontSize:14, color:"#e8eaf0", opacity:.45, lineHeight:1.8, marginBottom:40 }}>
          Platform edukasi Bitcoin terlengkap untuk investor Indonesia.
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {[
            { icon:"🎓", label:"6 Modul Terstruktur", sub:"Dari dasar sampai analisis teknikal" },
            { icon:"📝", label:"Artikel Mendalam", sub:"Ditulis oleh pakar kripto Indonesia" },
            { icon:"📊", label:"Progres Tersimpan", sub:"Lanjutkan kapan saja, di mana saja" },
            { icon:"💱", label:"Konverter Realtime", sub:"BTC ↔ IDR langsung di dashboard" },
          ].map((f) => (
            <div key={f.label} style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${A}12`, border:`1px solid ${A}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0" }}>{f.label}</div>
                <div style={{ fontSize:11, opacity:.4, color:"#e8eaf0" }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating card decoration */}
        <div style={{ position:"absolute", bottom:60, right:-1, transform:"translateX(50%)", width:180, padding:"16px 18px", background:"rgba(15,16,26,0.95)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, boxShadow:"0 24px 48px rgba(0,0,0,0.5)", animation:"float 4s ease-in-out infinite" }}>
          <div style={{ fontSize:10, opacity:.35, color:"#e8eaf0", marginBottom:6, fontFamily:"monospace" }}>PROGRESS KAMU</div>
          <div style={{ fontSize:20, fontWeight:900, color:A, marginBottom:8 }}>68%</div>
          <div style={{ height:4, borderRadius:99, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
            <div style={{ height:"100%", width:"68%", borderRadius:99, background:`linear-gradient(to right, ${A}, #f97316)` }} />
          </div>
          <div style={{ fontSize:10, opacity:.4, color:"#e8eaf0", marginTop:6 }}>Modul 4 dari 6</div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp .4s ease both" }}>

          {/* Mobile logo */}
          <div style={{ textAlign:"center", marginBottom:32 }} className="lg:hidden">
            <div style={{ width:52, height:52, borderRadius:15, margin:"0 auto 14px", background:`linear-gradient(135deg, ${A}, #f97316)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:20, color:"#000", boxShadow:`0 8px 24px ${A}40` }}>LH</div>
            <h1 style={{ fontSize:"1.7rem", fontWeight:900, color:"#e8eaf0", margin:0 }}>Masuk ke <span style={{ color:A }}>LearnHub</span></h1>
          </div>

          <div className="hidden lg:block" style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:"1.8rem", fontWeight:900, color:"#e8eaf0", margin:"0 0 6px", letterSpacing:"-0.5px" }}>Selamat Datang 👋</h2>
            <p style={{ fontSize:13, color:"#e8eaf0", opacity:.4, margin:0 }}>Masuk untuk lanjutkan perjalanan belajarmu.</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} style={{ width:"100%", padding:"12px 16px", borderRadius:12, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", color:"#e8eaf0", marginBottom:16, transition:"all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Masuk dengan Google
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize:11, color:"#e8eaf0", opacity:.3 }}>atau dengan email</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#e8eaf0", opacity:.5, display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.08em" }}>Email</label>
              <div className="inp-wrap">
                <span className="inp-icon">✉</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kamu.com" autoComplete="email" />
              </div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <label style={{ fontSize:11, fontWeight:700, color:"#e8eaf0", opacity:.5, textTransform:"uppercase", letterSpacing:"0.08em" }}>Password</label>
                <span style={{ fontSize:11, color:A, opacity:.8, cursor:"pointer" }}>Lupa password?</span>
              </div>
              <div className="inp-wrap">
                <span className="inp-icon">🔒</span>
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ padding:"0 14px", background:"none", border:"none", cursor:"pointer", fontSize:14, opacity:.35, color:"#e8eaf0" }}>{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>

            {error && (
              <div style={{ padding:"11px 14px", borderRadius:10, fontSize:12, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", display:"flex", alignItems:"center", gap:8 }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:12, fontSize:14, fontWeight:800, border:"none", marginTop:2, cursor:loading ? "not-allowed" : "pointer", background:loading ? `${A}30` : `linear-gradient(135deg, ${A}, #f97316)`, color:loading ? "rgba(0,0,0,0.4)" : "#000", boxShadow:loading ? "none" : `0 8px 24px ${A}35`, transition:"all .2s", letterSpacing:"-0.2px" }}>
              {loading ? "Memproses..." : "Masuk Sekarang →"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:"#e8eaf0", opacity:.45 }}>
            Belum punya akun?{" "}
            <Link href="/register" style={{ color:A, fontWeight:700, textDecoration:"none" }}>Daftar Gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
