"use client";

import {
  CodeEditor,
  TableHeader,
  TableRow,
  TableRowCode,
  TableRowCodeLine,
  TableRowLang,
  TableRowRank,
  TableRowScore,
  Toggle,
} from "@/components/ui";
import { Button } from "@/components/ui";
import { useState } from "react";

const sampleCode = "";

export default function Home() {
  const [code, setCode] = useState(sampleCode);
  const [roastMode, setRoastMode] = useState(true);

  const hasCode = code.trim().length > 0;

  return (
    <div className="bg-bg-page flex justify-center">
      <main className="flex flex-col pt-10 md:pt-20 px-4 md:px-10 gap-6 md:gap-8 w-full max-w-5xl justify-center items-center">
        {/* Hero Section */}
        <div className="flex flex-col gap-2 md:gap-3 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <span className="text-accent-green text-2xl md:text-4xl font-bold font-mono">$</span>
            <h1 className="text-text-primary text-2xl md:text-4xl font-bold font-mono">
              paste your code. get roasted.
            </h1>
          </div>
          <p className="text-text-secondary font-[family-name:var(--font-secondary)] text-xs md:text-sm">
            {
              "// drop your code below and we&apos;ll rate it — brutally honest or full roast mode. "
            }
          </p>
        </div>

        {/* Code Editor */}
        <CodeEditor value={code} onChange={setCode} />

        {/* Actions Bar */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} />
            <span className="text-text-tertiary font-[family-name:var(--font-secondary)] text-xs hidden md:inline">
              {"// maximum sarcasm enabled "}
            </span>
          </div>
          <Button disabled={!hasCode}>$ roast_my_code</Button>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
          <span className="text-text-tertiary font-[family-name:var(--font-secondary)] text-xs">
            2,847 codes roasted
          </span>
          <span className="text-text-tertiary font-mono text-xs">·</span>
          <span className="text-text-tertiary font-[family-name:var(--font-secondary)] text-xs">
            avg score: 4.2/10
          </span>
        </div>

        {/* Spacer */}
        <div className="h-8 md:h-16" />

        {/* Leaderboard Preview */}
        <div className="flex flex-col gap-4 md:gap-6 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <span className="text-accent-green text-sm font-bold font-mono">{"//"}</span>
              <h2 className="text-text-primary text-sm font-bold font-mono">shame_leaderboard</h2>
            </div>
            <Button variant="link" size="link">
              $ view_all &gt;&gt;
            </Button>
          </div>

          <p className="text-text-tertiary font-[family-name:var(--font-secondary)] text-xs">
            {"// the worst code on the internet, ranked by shame"}
          </p>

          {/* Table */}
          <div className="flex flex-col border border-border-primary">
            <TableHeader />

            {/* Table Rows */}
            <div className="flex flex-col">
              <TableRow>
                <TableRowRank variant="gold">1</TableRowRank>
                <TableRowScore variant="critical">1.2</TableRowScore>
                <TableRowCode>
                  {'eval(prompt("enter code")'}
                  {"document.write(response)"}
                  <TableRowCodeLine variant="comment">{"// trust the user lol"}</TableRowCodeLine>
                </TableRowCode>
                <TableRowLang>javascript</TableRowLang>
              </TableRow>
              <TableRow>
                <TableRowRank>2</TableRowRank>
                <TableRowScore variant="critical">1.8</TableRowScore>
                <TableRowCode>
                  {"if (x == true) { return true; }"}
                  {"else if (x == false) { return false; }"}
                  {"else { return !false; }"}
                </TableRowCode>
                <TableRowLang>typescript</TableRowLang>
              </TableRow>
              <TableRow>
                <TableRowRank>3</TableRowRank>
                <TableRowScore variant="critical">2.1</TableRowScore>
                <TableRowCode>
                  {"SELECT * FROM users WHERE 1=1"}
                  <TableRowCodeLine variant="comment">
                    {"-- TODO: add authentication"}
                  </TableRowCodeLine>
                </TableRowCode>
                <TableRowLang>sql</TableRowLang>
              </TableRow>
            </div>
          </div>

          <div className="flex justify-center py-2 md:py-4">
            <span className="text-text-tertiary font-[family-name:var(--font-secondary)] text-xs">
              showing top 3 of 2,847 ·{" "}
              <a href="/leaderboard" className="hover:text-text-secondary no-underline">
                view full leaderboard &gt;&gt;
              </a>
            </span>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-8 md:h-16" />
      </main>
    </div>
  );
}
