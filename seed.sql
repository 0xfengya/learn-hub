-- ============================================================
-- LearnHub Seed File
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- PENTING: Jalankan SETELAH register akun admin di /register
-- ============================================================

-- ── 1. Set akun admin (ganti email sesuai yang kamu daftarkan) ──
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'admin@learnhub.id'  -- ← ganti dengan email admin kamu
);

-- Verifikasi hasilnya
SELECT p.id, p.name, p.role, u.email, p.created_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC;
