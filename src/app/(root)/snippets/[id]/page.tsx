"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import NavigationHeader from "@/components/NavigationHeader";
import { Clock, Code, MessageSquare, User } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "@/app/(root)/_constants";
// import Comments from "./_components/Comments";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import CopyButton from "./_components/CopyButton";
import SnippetLoadingSkeleton from "./_components/SnippetLoadingSkeleton";

function SnippetDetailPage() {
  const snippetId = useParams().id;

  const snippet = useQuery(api.snippets.getSnippetById, { snippetId: snippetId as Id<"snippets"> });
  const comments = useQuery(api.snippets.getComments, { snippetId: snippetId as Id<"snippets"> });

  if (snippet === undefined) return <SnippetLoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg backdrop-blur-sm mb-6">
  <div className="flex flex-col sm:flex-row items-center justify-between">
    {/* Left section with image and details */}
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gray-700 rounded-lg p-1">
        <img
          src={`/${snippet.language}.png`}
          alt={`${snippet.language} logo`}
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">{snippet.title}</h1>
        <div className="flex items-center space-x-3 mt-2 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{snippet.userName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(snippet._creationTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{comments?.length} comments</span>
          </div>
        </div>
      </div>
    </div>
    {/* Right section with language tag */}
    <div className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white rounded-full text-lg font-semibold shadow-md transition-transform hover:scale-105">
      {snippet.language}
    </div>
  </div>
</div>


          {/* Code Editor */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#ffffff0a]">
              <div className="flex items-center gap-2 text-[#808086]">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Source Code</span>
              </div>
              <CopyButton code={snippet.code} />
            </div>
            <Editor
              height="600px"
              language={LANGUAGE_CONFIG[snippet.language].monacoLanguage}
              value={snippet.code}
              theme="vs-dark"
              beforeMount={defineMonacoThemes}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                readOnly: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
              }}
            />
          </div>

          {/* <Comments snippetId={snippet._id} /> */}
        </div>
      </main>
    </div>
  );
}
export default SnippetDetailPage;