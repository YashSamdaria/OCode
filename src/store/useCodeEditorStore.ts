import { create } from "zustand";
import { Monaco } from "@monaco-editor/react";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { CodeEditorState } from "./../types/index";
import { output } from "framer-motion/client";

// Function to get initial state safely (handles SSR)
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
    output: "",
    isRunning: false,
    error: null,
    editor: null,
    executionResult: null,

    // Get code from Monaco editor
    getCode: () => get().editor?.getValue() || "",

    // Set editor instance & load saved code
    setEditor: (editor: Monaco) => {
      if (!editor) return;

      const currentLanguage = get().language;
      const savedCode = localStorage.getItem(`editor-code-${currentLanguage}`);

      // Load saved code only if it exists
      if (savedCode !== null) {
        editor.setValue(savedCode);
      }

      set({ editor });
    },

    // Update theme and save to localStorage
    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    // Update font size and save to localStorage
    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    // Update language, save code for the current language before switching
    setLanguage: (language: string) => {
      const currentCode = get().editor?.getValue();

      console.log(get().editor)
      // Save current code only if the editor is initialized
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


    // Function to execute code via Piston API
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
        console.log("Data : ", data);
    
        // Handle API errors
        if (data.message) {
          set({ error: data.message, executionResult: { code, output: "", error: data.message } });
          return;
        }
    
        // Handle compilation errors only if compile data exists
        if (data.compile && data.compile.code !== 0) {
          const error = data.compile.stderr || data.compile.stdout || "Compilation failed";
          set({ error, executionResult: { code, output: "", error } });
          return;
        }
    
        // Handle runtime errors
        if (!data.run || data.run.code !== 0) {
          const error = data.run?.stderr || data.run?.stdout || "Unknown error occurred";
          set({ error, executionResult: { code, output: "", error } });
          return;
        }
    
        // Successful execution
        set({
          output: data.run.stdout.trim(),
          error: null,
          executionResult: { code, output: data.run.stdout.trim(), error: null },
        });
    
      } catch (error) {
        console.error("Error running code:", error);
        const existingError = get().executionResult?.error;
        set({
          error: existingError || "Unexpected error occurred while running code",
          executionResult: {
            code,
            output: "",
            error: existingError || "Unexpected error occurred while running code",
          },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

// Function to get the latest execution result (useful for other components)
export const getExecutionResult = () => useCodeEditorStore.getState().executionResult;
