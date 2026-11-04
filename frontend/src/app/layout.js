
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CredVault",
  description: "Certificate Issuing & Verification Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0b1120] text-white">
        <header className="border-b border-slate-700 bg-[#0b1120]">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                CredVault
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/admin/login"
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Admin
              </Link>
            </div>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
