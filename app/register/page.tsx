"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const strengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e", "#06b6d4"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm) { setError("Semua field wajib diisi."); return; }
    if (password !== confirm) { setError("Password tidak cocok."); return; }
    if (password.length < 8) { setError("Password minimal 8 karakter."); return; }
    if (!agree) { setError("Setujui syarat & ketentuan terlebih dahulu."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    });
    setLoading(false);
    if (authError) {
      if (authError.message.includes("already registered")) setError("Email sudah terdaftar. Coba masuk.");
      else setError(authError.message);
      return;
    }
    setSuccess(true);
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/edukasi` },
    });
  };

  const A = "#f59e0b";

  if (success) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#080910", padding:24 }}>
      <div style={{ textAlign:"center", maxWidth:420, animation:"fadeUp .4s ease both" }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}} @keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}`}</style>
        <div style={{ fontSize:64, marginBottom:20, animation:"bounce 0.6s ease" }}>🎉</div>
        <h2 style={{ fontSize:"1.8rem", fontWeight:900, color:"#e8eaf0", marginBottom:10, letterSpacing:"-0.5px" }}>Akun Berhasil Dibuat!</h2>
        <p style={{ fontSize:14, color:"#e8eaf0", opacity:.5, lineHeight:1.8, marginBottom:28 }}>
          Cek email <strong style={{ color:A }}>{email}</strong> untuk konfirmasi akunmu, lalu login dan mulai belajar.
        </p>
        <div style={{ padding:"16px 20px", borderRadius:14, background:`${A}0d`, border:`1px solid ${A}25`, marginBottom:28, textAlign:"left" }}>
          <div style={{ fontSize:12, fontWeight:700, color:A, marginBottom:8 }}>📬 Langkah selanjutnya:</div>
          {["Buka email yang kamu daftarkan", "Klik link konfirmasi dari LearnHub", "Login dan mulai belajar Bitcoin!"].map((s, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom: i < 2 ? 7 : 0, fontSize:12, color:"#e8eaf0", opacity:.7 }}>
              <span style={{ color:A, fontWeight:700, flexShrink:0 }}>{i+1}.</span> {s}
            </div>
          ))}
        </div>
        <Link href="/login" style={{ display:"block", padding:"13px", borderRadius:12, fontSize:14, fontWeight:800, background:`linear-gradient(135deg, ${A}, #f97316)`, color:"#000", textDecoration:"none", boxShadow:`0 8px 24px ${A}35` }}>
          Pergi ke Halaman Login →
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"#080910", position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
        @keyframes pulse { 0%,100% { opacity:.12 } 50% { opacity:.22 } }
        .inp-wrap { display:flex; align-items:center; background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.09); border-radius:12px; transition:border .2s,background .2s; }
        .inp-wrap:focus-within { border-color:${A}60; background:rgba(245,158,11,0.04); }
        .inp-wrap input { flex:1; background:transparent; border:none; padding:13px 14px; font-size:14px; color:#e8eaf0; outline:none; }
        .inp-wrap input::placeholder { opacity:.3; }
        .inp-icon { padding:0 14px; font-size:15px; opacity:.3; flex-shrink:0; }
        * { box-sizing:border-box; }
      `}</style>

      {/* Background blobs */}
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, ${A}10 0%, transparent 65%)`, top:-150, left:-100, pointerEvents:"none", animation:"pulse 5s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)", bottom:-50, right:-50, pointerEvents:"none" }} />

      {/* Left panel */}
      <div style={{ flex:"0 0 460px", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 52px", borderRight:"1px solid rgba(255,255,255,0.05)", position:"relative" }} className="hidden lg:flex">
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:48 }}>
          <div style={{ width:44, height:44, borderRadius:13, background:`linear-gradient(135deg, ${A}, #f97316)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:18, color:"#000", boxShadow:`0 8px 24px ${A}40` }}>LH</div>
          <div>
            <div style={{ fontWeight:900, fontSize:20, color:"#e8eaf0", letterSpacing:"-0.3px" }}>Learn<span style={{ color:A }}>Hub</span></div>
            <div style={{ fontSize:10, opacity:.3, letterSpacing:"0.14em", color:"#e8eaf0", fontFamily:"monospace" }}>BITCOIN ACADEMY</div>
          </div>
        </div>

        <h2 style={{ fontSize:"2.4rem", fontWeight:900, color:"#e8eaf0", lineHeight:1.15, marginBottom:14, letterSpacing:"-1px" }}>
          Mulai Perjalanan<br /><span style={{ color:A }}>Bitcoin-mu</span><br />Hari Ini
        </h2>
        <p style={{ fontSize:14, color:"#e8eaf0", opacity:.45, lineHeight:1.8, marginBottom:36 }}>
          Gratis selamanya. Tidak ada kartu kredit. Mulai belajar dalam 2 menit.
        </p>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:32 }}>
          {[
            { val:"10K+", label:"Pelajar Aktif" },
            { val:"95%", label:"Rating Positif" },
            { val:"6", label:"Modul Lengkap" },
            { val:"Gratis", label:"Selamanya" },
          ].map((s) => (
            <div key={s.label} style={{ padding:"14px 16px", borderRadius:12, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize:18, fontWeight:900, color:A, letterSpacing:"-0.5px", marginBottom:2 }}>{s.val}</div>
              <div style={{ fontSize:11, opacity:.4, color:"#e8eaf0" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ padding:"18px 20px", borderRadius:14, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize:13, color:"#e8eaf0", opacity:.6, lineHeight:1.7, fontStyle:"italic", marginBottom:12 }}>
            "Akhirnya nemu platform edukasi Bitcoin yang beneran bagus. Dari nol sekarang udah ngerti gimana cara DCA yang bener."
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg, ${A}40, #f97316)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, color:A }}>R</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#e8eaf0" }}>Rizky, Jakarta</div>
              <div style={{ fontSize:10, opacity:.35, color:"#e8eaf0" }}>Investor pemula</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp .4s ease both" }}>

          {/* Mobile logo */}
          <div style={{ textAlign:"center", marginBottom:28 }} className="lg:hidden">
            <div style={{ width:52, height:52, borderRadius:15, margin:"0 auto 14px", background:`linear-gradient(135deg, ${A}, #f97316)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:20, color:"#000" }}>LH</div>
            <h1 style={{ fontSize:"1.6rem", fontWeight:900, color:"#e8eaf0", margin:0 }}>Daftar ke <span style={{ color:A }}>LearnHub</span></h1>
          </div>

          <div className="hidden lg:block" style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:"1.7rem", fontWeight:900, color:"#e8eaf0", margin:"0 0 6px", letterSpacing:"-0.5px" }}>Buat Akun Gratis 🚀</h2>
            <p style={{ fontSize:13, color:"#e8eaf0", opacity:.4, margin:0 }}>Tidak perlu kartu kredit. Langsung mulai belajar.</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} style={{ width:"100%", padding:"12px 16px", borderRadius:12, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)", color:"#e8eaf0", marginBottom:16, transition:"all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Daftar dengan Google
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize:11, color:"#e8eaf0", opacity:.3 }}>atau isi form</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#e8eaf0", opacity:.5, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Nama Lengkap</label>
              <div className="inp-wrap">
                <span className="inp-icon">👤</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" autoComplete="name" />
              </div>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#e8eaf0", opacity:.5, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Email</label>
              <div className="inp-wrap">
                <span className="inp-icon">✉</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kamu.com" autoComplete="email" />
              </div>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#e8eaf0", opacity:.5, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Password</label>
              <div className="inp-wrap">
                <span className="inp-icon">🔒</span>
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 karakter" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ padding:"0 14px", background:"none", border:"none", cursor:"pointer", fontSize:14, opacity:.35, color:"#e8eaf0" }}>{showPass ? "🙈" : "👁"}</button>
              </div>
              {password && (
                <div style={{ marginTop:7 }}>
                  <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${strength * 25}%`, background:strengthColor, borderRadius:99, transition:"all .3s" }} />
                  </div>
                  <span style={{ fontSize:10, color:strengthColor, fontWeight:700, marginTop:4, display:"block" }}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:"#e8eaf0", opacity:.5, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Konfirmasi Password</label>
              <div className="inp-wrap">
                <span className="inp-icon">🔐</span>
                <input type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Ulangi password" autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ padding:"0 14px", background:"none", border:"none", cursor:"pointer", fontSize:14, opacity:.35, color:"#e8eaf0" }}>{showConfirm ? "🙈" : "👁"}</button>
              </div>
              {confirm && password && (
                <span style={{ fontSize:10, fontWeight:700, marginTop:5, display:"block", color: password === confirm ? "#22c55e" : "#ef4444" }}>
                  {password === confirm ? "✓ Password cocok" : "✗ Password tidak cocok"}
                </span>
              )}
            </div>

            {/* Agree */}
            <label style={{ display:"flex", alignItems:"flex-start", gap:11, cursor:"pointer", padding:"10px 14px", borderRadius:10, background: agree ? `${A}08` : "rgba(255,255,255,0.03)", border:`1px solid ${agree ? A+"25" : "rgba(255,255,255,0.07)"}`, transition:"all .2s" }}>
              <div onClick={() => setAgree(!agree)} style={{ width:18, height:18, borderRadius:5, border:`2px solid ${agree ? A : "rgba(255,255,255,0.2)"}`, background: agree ? A : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, transition:"all .2s", cursor:"pointer" }}>
                {agree && <span style={{ fontSize:11, fontWeight:900, color:"#000" }}>✓</span>}
              </div>
              <span style={{ fontSize:12, color:"#e8eaf0", opacity:.55, lineHeight:1.6 }}>
                Saya menyetujui <span style={{ color:A }}>syarat & ketentuan</span> serta <span style={{ color:A }}>kebijakan privasi</span> LearnHub
              </span>
            </label>

            {error && (
              <div style={{ padding:"11px 14px", borderRadius:10, fontSize:12, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171", display:"flex", alignItems:"center", gap:8 }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:12, fontSize:14, fontWeight:800, border:"none", marginTop:2, cursor:loading ? "not-allowed" : "pointer", background:loading ? `${A}30` : `linear-gradient(135deg, ${A}, #f97316)`, color:loading ? "rgba(0,0,0,0.4)" : "#000", boxShadow:loading ? "none" : `0 8px 24px ${A}35`, transition:"all .2s", letterSpacing:"-0.2px" }}>
              {loading ? "Membuat akun..." : "Buat Akun Gratis 🚀"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:20, fontSize:13, color:"#e8eaf0", opacity:.45 }}>
            Sudah punya akun?{" "}
            <Link href="/login" style={{ color:A, fontWeight:700, textDecoration:"none" }}>Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
