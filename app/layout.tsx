import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Internal Audit System",
  description: "7 días para identificar exactamente qué está generando fricción interna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
