import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnHub - Bitcoin & Blockchain Education",
  description:
    "Platform edukasi Bitcoin & Blockchain terlengkap dalam Bahasa Indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="luxury" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
