// import React from 'react'; // For React functionality
// import Link from 'next/link'; // For navigation between pages in Next.js
// import { Blocks, Code2 } from 'lucide-react'; // For the icon components used in the UI
// import RunButton from './RunButton'; // Custom component for the run button
// import LanguageSelector from './LanguageSelector'; // Custom component for language selector

// // Removed the convex API query and other potential problematic parts for now

// export const dynamic = "force-dynamic"; // You can keep this if necessary

// async function Header() {
//   try {
//     // Temporary hardcoded values to prevent fetch failure
//     const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
//     if (!convexUrl) {
//       throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined in environment variables");
//     }

//     // Commented out API query to avoid the timeout error
//     // const convex = new ConvexHttpClient(convexUrl);
//     // const user = await currentUser();

//     // Temporarily hardcoded user data
//     // const user = {
//     //   id: 'user_2tFKRvxioyZK1atdglhUEewNYDz',
//     //   firstName: 'Yash',
//     //   lastName: 'Samdaria',
//     //   imageUrl: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydEZLUnpRUnZFVkdKbFA5Zk9rd01EN3k3ejMifQ',
//     // };

//     // // If no user data, set a fallback value
//     // const convexUser = { isPro: false };

//     return (
//       <div className="relative z-10">
//         <div className="flex items-center lg:justify-between justify-center bg-[#0a0a0f]/80 backdrop-blur-xl p-4 rounded-lg">
//           <div className="hidden lg:flex items-center gap-8">
//             <Link href="/" className="flex items-center gap-3 group relative">
//               <div
//                 className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
//                            rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"
//               />
//               <div
//                 className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 
//                            ring-white/10 group-hover:ring-white/20 transition-all"
//               >
//                 <Blocks className="size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 
//                                  via-blue-300 to-purple-400 text-transparent bg-clip-text">
//                   OCode
//                 </span>
//                 <span className="block text-xs text-blue-400/60 font-medium">
//                   Interactive Online Code Editor
//                 </span>
//               </div>
//             </Link>
//             <nav className="flex items-center space-x-1">
//               <Link
//                 href="/snippets"
//                 className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 
//                            bg-gray-800/50 hover:bg-blue-500/10 border border-gray-800 
//                            hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
//               >
//                 <div
//                   className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
//                              to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
//                 />
//                 <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
//                 <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
//                   Snippets
//                 </span>
//               </Link>
//             </nav>
//           </div>
//           <div className="flex items-center gap-4">
//             <RunButton />
//             <div className="flex items-center gap-3">
//               {/* Temporarily set `hasAccess` to false */}
//               <LanguageSelector hasAccess={false} />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Header Error:", error);
//     return (
//       <div className="p-4 text-red-500">
//         Error loading header: {(error as Error).message}
//       </div>
//     );
//   }
// }

// export default Header;


import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Blocks, Code2, Sparkles } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";

export const dynamic = "force-dynamic";

async function Header() {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    console.log("Convex URL:", convexUrl);

    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined in environment variables");
    }

    const convex = new ConvexHttpClient(convexUrl);

    const user = await currentUser();
    console.log("Current User:", user);

    let convexUser = null;
    if (user && user.id) {
      convexUser = await convex.query(api.users.getUser, { userId: user.id });
      console.log("Convex User Data:", convexUser);
    }

    return (
      <div className="relative z-10">
        <div className="flex items-center lg:justify-between justify-center bg-[#0a0a0f]/80 backdrop-blur-xl p-4 rounded-lg">
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                <Blocks className="size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                  OCode
                </span>
                <span className="block text-xs text-blue-400/60 font-medium">
                  Interactive Online Code Editor
                </span>
              </div>
            </Link>
            <nav className="flex items-center space-x-1">
              <Link
                href="/snippets"
                className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
                <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                  Snippets
                </span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <RunButton />
            <div className="flex items-center gap-3">
              <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
            </div>
            {!convexUser?.isPro && (
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
                <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                  Pro
                </span>
              </Link>
            )}
            <div className="pl-3 border-l border-gray-800">
              <HeaderProfileBtn />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Header Error:", error);
    return (
      <div className="p-4 text-red-500">
        Error loading header: {(error as Error).message}
      </div>
    );
  }
}

export default Header;
