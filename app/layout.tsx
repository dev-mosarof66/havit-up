import type { Metadata } from "next";
import { Noto_Sans, Stack_Sans_Notch } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import Sidebar from "@/components/sidebar";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const stackSans = Stack_Sans_Notch({
  variable: "--font-stack-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Habit Up | Personal Habit Tracker",
  description: "Track your habits and evolve with AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${stackSans.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeRegistry>
          <div className="w-full h-screen flex items-center gap-4">
            <Sidebar />
            <div className="flex-1 h-screen overflow-y-scroll">
              {children}
            </div>
          </div>
        </ThemeRegistry>
      </body>
    </html>
  );
}
