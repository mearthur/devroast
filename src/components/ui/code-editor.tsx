"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  placeholder?: string;
  autoDetect?: boolean;
  showLineNumbers?: boolean;
}

const LANGUAGES = [
  {
    value: "javascript",
    label: "JavaScript",
    keywords: [
      "function",
      "const",
      "let",
      "var",
      "=>",
      "console",
      "require",
      "import ",
      "export ",
      "async ",
      "await ",
    ],
  },
  {
    value: "typescript",
    label: "TypeScript",
    keywords: [
      "interface ",
      "type ",
      ": string",
      ": number",
      ": boolean",
      "<T>",
      "as ",
      "readonly ",
    ],
  },
  {
    value: "python",
    label: "Python",
    keywords: [
      "def ",
      "import ",
      "from ",
      "class ",
      "self.",
      "print(",
      "if __name__",
      "elif ",
      "except:",
      "lambda ",
    ],
  },
  {
    value: "go",
    label: "Go",
    keywords: [
      "func ",
      "package ",
      "import (",
      "type ",
      "struct {",
      "interface {",
      "go ",
      "defer ",
      "chan ",
      "<-",
    ],
  },
  {
    value: "rust",
    label: "Rust",
    keywords: [
      "fn ",
      "let mut",
      "impl ",
      "pub fn",
      "use ",
      "mod ",
      "struct ",
      "enum ",
      "match ",
      "->",
    ],
  },
  {
    value: "java",
    label: "Java",
    keywords: [
      "public class",
      "private ",
      "protected ",
      "System.out",
      "void ",
      "static ",
      "extends ",
      "implements ",
    ],
  },
  {
    value: "csharp",
    label: "C#",
    keywords: [
      "namespace ",
      "public class",
      "private ",
      "protected ",
      "void ",
      "static ",
      "async Task",
      "using System",
    ],
  },
  {
    value: "cpp",
    label: "C++",
    keywords: ["#include", "std::", "cout <<", "cin >>", "nullptr", "template<", "namespace "],
  },
  {
    value: "sql",
    label: "SQL",
    keywords: [
      "SELECT ",
      "FROM ",
      "WHERE ",
      "INSERT ",
      "UPDATE ",
      "DELETE ",
      "CREATE TABLE",
      "ALTER TABLE",
      "JOIN ",
    ],
  },
  {
    value: "html",
    label: "HTML",
    keywords: [
      "<html",
      "<div",
      "<span",
      "<p>",
      "<!DOCTYPE",
      "<head>",
      "<body>",
      "<script>",
      "<style>",
    ],
  },
  {
    value: "css",
    label: "CSS",
    keywords: [
      "{",
      "}",
      "color:",
      "background:",
      "margin:",
      "padding:",
      "font-",
      "display:",
      "position:",
    ],
  },
  {
    value: "php",
    label: "PHP",
    keywords: ["<?php", "$", "function ", "echo ", "require ", "class ", "public ", "private "],
  },
  {
    value: "ruby",
    label: "Ruby",
    keywords: ["def ", "end", "class ", "module ", "puts ", "require ", "attr_"],
  },
  {
    value: "swift",
    label: "Swift",
    keywords: [
      "func ",
      "var ",
      "let ",
      "struct ",
      "class ",
      "enum ",
      "guard ",
      "import Foundation",
    ],
  },
  {
    value: "kotlin",
    label: "Kotlin",
    keywords: [
      "fun ",
      "val ",
      "var ",
      "class ",
      "object ",
      "data class",
      "suspend ",
      "companion object",
    ],
  },
  { value: "json", label: "JSON", keywords: ['{"', '"}', '":"', '":', "true", "false", "null"] },
  {
    value: "bash",
    label: "Bash",
    keywords: [
      "#!/bin/bash",
      "echo ",
      "if [",
      "fi",
      "then",
      "else",
      "for ",
      "while ",
      "do",
      "done",
    ],
  },
];

function detectLanguage(code: string): string {
  if (!code || code.trim().length < 2) return "plaintext";

  const codeLower = code.toLowerCase();
  let bestMatch = { language: "plaintext", score: 0 };

  for (const lang of LANGUAGES) {
    let score = 0;
    for (const keyword of lang.keywords) {
      if (code.includes(keyword) || codeLower.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { language: lang.value, score };
    }
  }

  // Minimum threshold to avoid false positives
  return bestMatch.score >= 1 ? bestMatch.language : "javascript";
}

export function CodeEditor({
  value,
  onChange,
  language: initialLanguage,
  onLanguageChange,
  placeholder = "// paste your code here...",
  autoDetect = true,
  showLineNumbers = true,
}: CodeEditorProps) {
  const [detectedLanguage, setDetectedLanguage] = useState(initialLanguage || "javascript");
  const [highlightedCode, setHighlightedCode] = useState("");
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const highlightedPreRef = useRef<HTMLPreElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const detectedLanguageRef = useRef(detectedLanguage);

  const currentLanguage = initialLanguage || detectedLanguage;

  // Keep ref updated
  useEffect(() => {
    detectedLanguageRef.current = detectedLanguage;
  }, [detectedLanguage]);

  // Auto-detect language when code changes
  useEffect(() => {
    if (autoDetect && value && value.trim().length > 10) {
      const detected = detectLanguage(value);
      if (detected !== currentLanguage && detected !== detectedLanguageRef.current) {
        setDetectedLanguage(detected);
        setIsAutoDetected(true);
      }
    }
  }, [value, autoDetect, currentLanguage]);

  // Highlight code with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!value) {
        setHighlightedCode("");
        return;
      }

      try {
        const html = await codeToHtml(value || "", {
          lang: currentLanguage,
          theme: "github-dark",
        });

        // Extract just the code content from shiki output
        const match = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
        setHighlightedCode(match ? match[1] : html);
      } catch {
        setHighlightedCode(value);
      }
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, currentLanguage]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightedPreRef.current) {
      highlightedPreRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightedPreRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleLanguageSelect = (lang: string) => {
    setDetectedLanguage(lang);
    setIsAutoDetected(false);
    onLanguageChange?.(lang);
    setShowLanguageMenu(false);
  };

  const lineCount = Math.max(value.split("\n").length, 10);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const currentLangLabel =
    LANGUAGES.find((l) => l.value === currentLanguage)?.label || "Plain Text";

  return (
    <div className="w-full h-[360px] border border-border-primary bg-bg-input overflow-hidden flex flex-col rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center justify-between h-10 px-4 border-b border-border-primary bg-bg-surface">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent-red" />
          <span className="w-3 h-3 rounded-full bg-accent-amber" />
          <span className="w-3 h-3 rounded-full bg-accent-green" />
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <span className="font-mono">{currentLangLabel}</span>
            {isAutoDetected && <span className="text-[10px] text-text-tertiary">(auto)</span>}
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 max-h-60 overflow-y-auto bg-bg-surface border border-border-primary rounded-md shadow-lg z-50">
              {LANGUAGES.map((lang) => (
                <button
                  type="button"
                  key={lang.value}
                  onClick={() => handleLanguageSelect(lang.value)}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-border-primary transition-colors ${
                    currentLanguage === lang.value
                      ? "text-accent-green bg-border-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        {showLineNumbers && (
          <div className="flex flex-col items-end w-12 border-r border-border-primary bg-bg-surface py-4 px-3">
            {lineNumbers.map((num) => (
              <span
                key={num}
                className="font-mono text-xs text-text-tertiary leading-6 select-none"
              >
                {num}
              </span>
            ))}
          </div>
        )}

        {/* Code Area */}
        <div className="relative flex-1 overflow-hidden">
          {/* Highlighted Code (background) */}
          <pre
            ref={highlightedPreRef}
            className="absolute inset-0 p-4 font-mono text-xs leading-6 overflow-hidden pointer-events-none text-transparent"
            aria-hidden="true"
          >
            <code
              className="shiki-highlight"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki produces safe HTML
              dangerouslySetInnerHTML={{
                __html: highlightedCode || `<span class="text-text-tertiary">${placeholder}</span>`,
              }}
            />
          </pre>

          {/* Textarea (foreground - transparent) */}
          <textarea
            ref={textareaRef}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-accent-green font-mono text-xs leading-6 resize-none focus:outline-none p-4 whitespace-pre overflow-auto"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            placeholder={placeholder}
            spellCheck={false}
            style={{ caretColor: "var(--color-accent-green)" }}
          />
        </div>
      </div>
    </div>
  );
}
