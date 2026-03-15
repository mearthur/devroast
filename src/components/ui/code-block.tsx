"use client";

import { forwardRef } from "react";

const LANGUAGES = {
  javascript: [
    "function",
    "const",
    "let",
    "var",
    "=>",
    "console.log",
    "require(",
    "import ",
    "export ",
    "async ",
    "await ",
  ],
  typescript: [
    "interface ",
    "type ",
    ": string",
    ": number",
    ": boolean",
    "<T>",
    "as ",
    "readonly ",
  ],
  python: [
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
  go: [
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
  rust: [
    "fn ",
    "let mut",
    "impl ",
    "pub fn",
    "use ",
    "mod ",
    "struct ",
    "enum ",
    "match ",
    "-> ",
    "&str",
    "Vec<",
  ],
  java: [
    "public class",
    "private ",
    "protected ",
    "void ",
    "System.out",
    "import java.",
    "extends ",
    "implements ",
  ],
  cpp: [
    "#include",
    "std::",
    "cout <<",
    "cin >>",
    "int main",
    "class ",
    "public:",
    "private:",
    "namespace ",
    "template<",
  ],
  csharp: [
    "using System",
    "namespace ",
    "public class",
    "private ",
    "protected ",
    "void ",
    "Console.Write",
    "async Task",
  ],
  ruby: ["def ", "end", "class ", "require ", "attr_", "puts ", "do |", "each do", "nil"],
  php: [
    "<?php",
    "function ",
    "class ",
    "public function",
    "private function",
    "echo ",
    "$_GET",
    "$this->",
  ],
  sql: [
    "SELECT ",
    "FROM ",
    "WHERE ",
    "INSERT ",
    "UPDATE ",
    "DELETE ",
    "JOIN ",
    "GROUP BY",
    "ORDER BY",
  ],
  html: ["<html", "<div", "<span", "<p>", "<!DOCTYPE", "<head>", "<body>", "<script>", "<style>"],
  css: ["{", "}", "color:", "background:", "margin:", "padding:", "display:", "font-", "border:"],
};

function detectLanguage(code: string): string {
  const lowerCode = code.toLowerCase();
  for (const [lang, patterns] of Object.entries(LANGUAGES)) {
    for (const pattern of patterns) {
      if (lowerCode.includes(pattern.toLowerCase())) {
        return lang;
      }
    }
  }
  return "javascript";
}

export interface CodeBlockProps {
  code?: string;
  language?: string;
  showLineNumbers?: boolean;
  fileName?: string;
  showDots?: boolean;
  editable?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code = "",
      language,
      showLineNumbers = true,
      fileName,
      showDots = true,
      editable = false,
      value,
      onValueChange,
      placeholder,
    },
    ref
  ) => {
    const content = editable ? value || "" : code;
    const codeLines = content.split("\n");
    const lineCount = codeLines.length;
    const detectedLanguage = language || (content ? detectLanguage(content) : "javascript");

    return (
      <div
        ref={ref}
        className="border border-border-primary bg-bg-input overflow-hidden w-full"
        style={{ minHeight: editable ? 280 : undefined }}
      >
        {(fileName || showDots) && (
          <div className="flex items-center h-10 px-3 md:px-4 border-b border-border-primary">
            {showDots && (
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent-red" />
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent-amber" />
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent-green" />
              </div>
            )}
            {fileName && (
              <span className="ml-auto font-mono text-xs text-text-tertiary truncate max-w-[120px] md:max-w-none">
                {fileName}
              </span>
            )}
            {!fileName && (
              <span className="ml-auto font-mono text-xs text-text-tertiary">
                {detectedLanguage}
              </span>
            )}
          </div>
        )}
        <div className="flex overflow-x-auto" style={{ minHeight: editable ? 240 : undefined }}>
          {showLineNumbers && (
            <div className="hidden md:flex flex-col border-r border-border-primary bg-bg-surface text-text-tertiary font-mono text-right w-10 md:w-12 p-2 md:p-3 gap-1.5 md:gap-2">
              {Array.from({ length: lineCount }, (_, i) => i + 1).map((num) => (
                <span key={`ln-${num}`} className="text-xs">
                  {num}
                </span>
              ))}
            </div>
          )}
          {editable ? (
            <textarea
              className="flex-1 bg-bg-input text-text-primary font-mono text-xs resize-none focus:outline-none p-3 md:p-4 min-w-0"
              value={value}
              onChange={(e) => onValueChange?.(e.target.value)}
              placeholder={placeholder}
              spellCheck={false}
            />
          ) : (
            <pre className="flex-1 bg-bg-input text-text-secondary font-mono overflow-x-auto p-3 md:p-4 min-w-0">
              <code>{code}</code>
            </pre>
          )}
        </div>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";
