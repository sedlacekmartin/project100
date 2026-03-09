import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project 100",
  description: "Time-based habit and addiction awareness tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
