import { useCallback, useEffect, useRef, useState } from "react";
import { codeToHtml } from "shiki";

export interface UseShikiHighlighterOptions {
  theme?: string;
  defaultTheme?: string;
}

export interface UseShikiHighlighterReturn {
  highlightedCode: string;
  isLoading: boolean;
  error: string | null;
}

export function useShikiHighlighter(
  code: string,
  language: string,
  options: UseShikiHighlighterOptions = {}
): UseShikiHighlighterReturn {
  const { theme = "github-dark" } = options;

  const [highlightedCode, setHighlightedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!code) {
        setHighlightedCode("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const html = await codeToHtml(code || "", {
          lang: language,
          theme: theme,
        });

        const match = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
        setHighlightedCode(match ? match[1] : html);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Highlight failed");
        setHighlightedCode(code);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [code, language, theme]);

  return {
    highlightedCode,
    isLoading,
    error,
  };
}
