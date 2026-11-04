
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CredVault
          </span>
        </h1>

        <p className="mt-5 text-base md:text-xl text-gray-300">
          Certificate Issuing &amp; Verification Platform
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/request"
            className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Request Certificate
          </Link>

          <Link
            href="/track"
            className="w-full sm:w-auto rounded-lg border border-blue-500 px-6 py-3 font-semibold text-blue-300 transition hover:bg-blue-500/10"
          >
            Track Application
          </Link>

          <Link
            href="/verify"
            className="w-full sm:w-auto rounded-lg border border-purple-500 px-6 py-3 font-semibold text-purple-300 transition hover:bg-purple-500/10"
          >
            Verify Certificate
          </Link>
        </div>
      </div>
    </main>
  );
}
