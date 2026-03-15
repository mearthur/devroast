import { useCallback, useEffect, useRef, useState } from "react";

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

  return bestMatch.score >= 1 ? bestMatch.language : "javascript";
}

export interface UseLanguageDetectionOptions {
  defaultLanguage?: string;
  autoDetect?: boolean;
}

export interface UseLanguageDetectionReturn {
  language: string;
  setLanguage: (lang: string) => void;
  isAutoDetected: boolean;
  detectedLanguage: string;
}

export function useLanguageDetection(
  code: string,
  options: UseLanguageDetectionOptions = {}
): UseLanguageDetectionReturn {
  const { defaultLanguage = "javascript", autoDetect = true } = options;

  const [detectedLanguage, setDetectedLanguage] = useState(defaultLanguage);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const detectedRef = useRef(detectedLanguage);

  useEffect(() => {
    detectedRef.current = detectedLanguage;
  }, [detectedLanguage]);

  useEffect(() => {
    if (autoDetect && code && code.trim().length > 10) {
      const detected = detectLanguage(code);
      if (detected !== detectedRef.current) {
        setDetectedLanguage(detected);
        setIsAutoDetected(true);
      }
    }
  }, [code, autoDetect]);

  const setLanguage = useCallback((lang: string) => {
    setDetectedLanguage(lang);
    setIsAutoDetected(false);
  }, []);

  return {
    language: detectedLanguage,
    setLanguage,
    isAutoDetected,
    detectedLanguage,
  };
}
