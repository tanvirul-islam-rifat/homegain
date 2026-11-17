import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], weight: ["500", "700"], display: "swap", variable: "--font-geist" });

export const metadata: Metadata = {
  title: { default: "HomeGain", template: "%s · HomeGain" },
  description: "My 7-day home workout and meal plan.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#110c09",
  colorScheme: "dark light",
};

// Applies the saved theme before first paint (no flash).
const themeScript = `(function(){try{var e=JSON.parse(localStorage.getItem("homegain")||"null"),t=e&&e.state&&e.state.settings&&e.state.settings.theme||"dark";if(t==="system")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(n){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={geist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
