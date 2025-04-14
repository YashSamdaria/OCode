import HeaderProfileBtn from "@/app/(root)/_components/HeaderProfileBtn";
import { SignedOut } from "@clerk/nextjs";
import { Blocks, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic"; 
function NavigationHeader() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      <div className="relative h-16">
        {/* Left side items (flush left) */}
        <div className="absolute left-0 top-0 h-full flex items-center gap-8 pl-4">
          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-3 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
              <Blocks className="w-6 h-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                OCode
              </h1>
              <p className="text-xs text-blue-400/60 font-medium">
                Interactive Online Code Editor
              </p>
            </div>
          </Link>
          {/* Home Link */}
          <Link
            href="/"
            className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gray-800/50 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-lg font-bold relative z-10 group-hover:text-white transition-colors">{`{`}</span>
            <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
            Let&apos;s Code
            </span>
            <span className="text-lg font-bold relative z-10 group-hover:text-white transition-colors">{`}`}</span>
          </Link>
        </div>
        {/* Right side items (flush right) */}
        <div className="absolute right-0 top-0 h-full flex items-center gap-4 pr-4">
          <SignedOut>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
              <span className="text-sm font-medium text-amber-400/90 group-hover:text-amber-300">
                Pro
              </span>
            </Link>
          </SignedOut>
          <HeaderProfileBtn />
        </div>
      </div>
    </header>
  );
}

export default NavigationHeader;
