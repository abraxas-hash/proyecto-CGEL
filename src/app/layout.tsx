import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CGEL Control - Sonepar",
  description: "Plataforma de Inteligencia Operativa y Seguridad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative text-white`}
      >
        {/* BACKGROUND ANIMADO PREMIUM */}
        <div className="fixed inset-0 z-[-1] bg-[#050505]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0047AB] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00d4ff] rounded-full blur-[150px] opacity-20"></div>
          <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-purple-600 rounded-full blur-[150px] opacity-20"></div>
          {/* Grid pattern sutil */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
        
        {children}
      </body>
    </html>
  );
}
