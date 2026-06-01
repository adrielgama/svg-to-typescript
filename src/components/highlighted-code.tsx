import type { ReactNode } from "react";

type HighlightedCodeProps = {
  code: string;
};

const TOKEN_PATTERN =
  /(\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:export|default|function|const|return|type|interface|extends|import|from)\b|\b(?:React|SVGProps|SVGSVGElement)\b|\b[A-Za-z_$][\w$:-]*(?==)|<\/?[A-Za-z][\w.:-]*|\/?>|\b\d+(?:\.\d+)?\b|[{}()[\].,:;=])/g;

const KEYWORDS = new Set([
  "export",
  "default",
  "function",
  "const",
  "return",
  "type",
  "interface",
  "extends",
  "import",
  "from",
]);

const TYPES = new Set(["React", "SVGProps", "SVGSVGElement"]);

export function HighlightedCode({ code }: HighlightedCodeProps) {
  return <>{highlight(code)}</>;
}

function highlight(code: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(code.slice(lastIndex, index));
    }

    nodes.push(
      <span key={`${index}-${token}`} className={getTokenClassName(token)}>
        {token}
      </span>,
    );

    lastIndex = index + token.length;
  }

  if (lastIndex < code.length) {
    nodes.push(code.slice(lastIndex));
  }

  return nodes;
}

function getTokenClassName(token: string) {
  if (token.startsWith("//") || token.startsWith("/*")) {
    return "text-slate-400 dark:text-zinc-500";
  }

  if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
    return "text-emerald-700 dark:text-emerald-300";
  }

  if (KEYWORDS.has(token)) {
    return "font-semibold text-sky-700 dark:text-sky-300";
  }

  if (TYPES.has(token)) {
    return "text-violet-700 dark:text-violet-300";
  }

  if (/^<\/?[A-Za-z]/.test(token)) {
    return "text-rose-700 dark:text-rose-300";
  }

  if (/^[A-Za-z_$][\w$:-]*$/.test(token)) {
    return "text-amber-700 dark:text-amber-300";
  }

  if (/^\d/.test(token)) {
    return "text-cyan-700 dark:text-cyan-300";
  }

  return "text-slate-500 dark:text-zinc-400";
}
