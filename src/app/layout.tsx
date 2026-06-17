import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";
import { PwaRegister } from "@/components/PwaRegister";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: "Nexus Control",
  description: "Plataforma de Inteligencia Operativa y Seguridad",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CGEL Portal",
  },
};

export const viewport: Viewport = {
  themeColor: "#00d4ff",
};

import { FloatingChat } from "@/components/ui/FloatingChat";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={cn("font-sans", notoSans.variable, playfairDisplayHeading.variable)}>
      <body
        className={cn(
          "min-h-screen dark:bg-[#0e1117] font-sans antialiased text-slate-900 dark:text-[#e2e8f0] flex flex-col relative custom-scrollbar",
          notoSans.variable,
          playfairDisplayHeading.variable
        )}
      >
        <ThemeProvider>
          <PwaRegister />
          {children}
          <FloatingChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
