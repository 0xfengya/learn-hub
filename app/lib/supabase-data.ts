// Helper untuk fetch artikel & modul dari Supabase
// TIDAK ada fallback ke dummy — kalau DB kosong, return array kosong
import { createClient } from "./supabase";

export type Article = {
  id: number;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  catColor: string;
};

export type Lesson = {
  title: string;
  dur: string;
  done: boolean;
};

export type Module = {
  id: number;
  num: string;
  icon: string;
  title: string;
  desc: string;
  longDesc: string;
  lessons: Lesson[];
  dur: string;
  level: string;
  done: boolean;
  accent: string;
  levelColor: string;
};

/** Fetch semua artikel dari Supabase. Return [] kalau kosong/gagal. */
export async function fetchArticles(): Promise<Article[]> {
  try {
    const sb = createClient();
    const { data, error } = await sb
      .from("articles")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((a: any) => ({
      id: a.id,
      category: a.category || "Pemula",
      readTime: a.read_time || "5 mnt",
      title: a.title,
      excerpt: a.excerpt || "",
      content: a.content || "",
      author: a.author || "Admin",
      date: new Date(a.created_at).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
      }),
      image: a.image_url || "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80",
      catColor: a.cat_color || "#22c55e",
    }));
  } catch {
    return [];
  }
}

/** Fetch satu artikel berdasarkan id */
export async function fetchArticleById(id: number): Promise<Article | null> {
  try {
    const sb = createClient();
    const { data, error } = await sb
      .from("articles")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      category: data.category || "Pemula",
      readTime: data.read_time || "5 mnt",
      title: data.title,
      excerpt: data.excerpt || "",
      content: data.content || "",
      author: data.author || "Admin",
      date: new Date(data.created_at).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
      }),
      image: data.image_url || "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80",
      catColor: data.cat_color || "#22c55e",
    };
  } catch {
    return null;
  }
}

/** Fetch semua modul + lesson dari Supabase. Return [] kalau kosong/gagal. */
export async function fetchModules(): Promise<Module[]> {
  try {
    const sb = createClient();
    const { data: modulesData, error: modError } = await sb
      .from("modules")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (modError || !modulesData || modulesData.length === 0) return [];

    const moduleIds = modulesData.map((m: any) => m.id);
    const { data: lessonsData } = await sb
      .from("module_lessons")
      .select("*")
      .in("module_id", moduleIds)
      .order("sort_order", { ascending: true });

    const lessonsByModule: Record<number, any[]> = {};
    (lessonsData || []).forEach((l: any) => {
      if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
      lessonsByModule[l.module_id].push(l);
    });

    return modulesData.map((m: any) => ({
      id: m.id,
      num: m.num || "01",
      icon: m.icon || "₿",
      title: m.title,
      desc: m.description || "",
      longDesc: m.long_desc || "",
      lessons: (lessonsByModule[m.id] || []).map((l: any) => ({
        title: l.title,
        dur: l.duration || "5 mnt",
        done: false,
      })),
      dur: m.duration || "30 mnt",
      level: m.level || "Pemula",
      done: false,
      accent: m.accent || "#f59e0b",
      levelColor: m.level_color || "#22c55e",
    }));
  } catch {
    return [];
  }
}

/** Fetch satu modul berdasarkan id */
export async function fetchModuleById(id: number): Promise<Module | null> {
  try {
    const sb = createClient();
    const { data: m, error } = await sb
      .from("modules")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .single();

    if (error || !m) return null;

    const { data: lessons } = await sb
      .from("module_lessons")
      .select("*")
      .eq("module_id", id)
      .order("sort_order", { ascending: true });

    return {
      id: m.id,
      num: m.num || "01",
      icon: m.icon || "₿",
      title: m.title,
      desc: m.description || "",
      longDesc: m.long_desc || "",
      lessons: (lessons || []).map((l: any) => ({
        title: l.title,
        dur: l.duration || "5 mnt",
        done: false,
      })),
      dur: m.duration || "30 mnt",
      level: m.level || "Pemula",
      done: false,
      accent: m.accent || "#f59e0b",
      levelColor: m.level_color || "#22c55e",
    };
  } catch {
    return null;
  }
}
