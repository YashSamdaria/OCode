import { create } from "zustand";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { CodeEditorState } from "@/types/index";
import * as monaco from "monaco-editor";

// SSR-safe initial state
const getInitialState = () => {
  if (typeof window === "undefined") {
    return { language: "cpp", theme: "vs-dark", fontSize: 16 };
  }

  return {
    language: localStorage.getItem("editor-language") || "cpp",
    theme: localStorage.getItem("editor-theme") || "vs-dark",
    fontSize: Number(localStorage.getItem("editor-font-size")) || 16,
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    editor: null,
    output: "",
    error: null,
    isRunning: false,
    executionResult: null,

    setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => {
      if (!editor) return;

      const currentLanguage = get().language;
      const savedCode = localStorage.getItem(`editor-code-${currentLanguage}`);
      if (savedCode !== null) {
        editor.setValue(savedCode);
      }

      set({ editor });
    },

    getCode: () => get().editor?.getValue() || "",

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: string) => {
      const currentCode = get().editor?.getValue();
      if (currentCode !== undefined && currentCode !== null) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      set({
        language,
        output: "",
        error: null,
      });
    },

    runCode: async () => {
      const { language, getCode } = get();
      const code = getCode();
      if (!code) {
        set({ error: "Please enter some code \nIf the problem persists, please reload the page." });
        return;
      }

      const languageConfig = LANGUAGE_CONFIG[language];
      if (!languageConfig) {
        set({ error: "Invalid language selected" });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        const runtime = languageConfig.pistonRuntime;
        if (!runtime) throw new Error("Runtime not available");

        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [{ content: code }],
          }),
        });

        const data = await response.json();
        console.log("Execution result:", data);

        if (data.message) {
          set({
            error: data.message,
            executionResult: { code, output: "", error: data.message },
          });
          return;
        }

        if (data.compile && data.compile.code !== 0) {
          const error = data.compile.stderr || data.compile.stdout || "Compilation failed";
          set({
            error,
            executionResult: { code, output: "", error },
          });
          return;
        }

        if (!data.run || data.run.code !== 0) {
          const error = data.run?.stderr || data.run?.stdout || "Unknown runtime error";
          set({
            error,
            executionResult: { code, output: "", error },
          });
          return;
        }

        set({
          output: data.run.stdout.trim(),
          error: null,
          executionResult: { code, output: data.run.stdout.trim(), error: null },
        });
      } catch (err) {
        const fallbackError = "Unexpected error occurred while running code.";
        console.error("Error:", err);
        set({
          error: fallbackError,
          executionResult: { code, output: "", error: fallbackError },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

// Optional helper to get latest result
export const getExecutionResult = () => useCodeEditorStore.getState().executionResult;
