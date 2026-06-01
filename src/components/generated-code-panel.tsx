import { Clipboard, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusMessage, type AppStatus } from "@/components/status-message";

type GeneratedCodePanelProps = {
  canUseCode: boolean;
  code: string;
  fileName: string;
  status: AppStatus | null;
  onCopy: () => void;
  onDownload: () => void;
};

export function GeneratedCodePanel({
  canUseCode,
  code,
  fileName,
  status,
  onCopy,
  onDownload,
}: GeneratedCodePanelProps) {
  return (
    <Card className="h-full overflow-hidden border-border/70 bg-card/95 shadow-none shadow-black/5">
      <CardHeader className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 sm:p-5">
        <div className="min-w-0">
          <CardTitle className="text-xl">Componente gerado</CardTitle>
          <CardDescription>
            Atualizado automaticamente conforme a entrada e as opções.
          </CardDescription>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button
            type="button"
            onClick={onCopy}
            disabled={!canUseCode}
            className="flex-1 sm:flex-none"
          >
            <Clipboard className="h-4 w-4" />
            Copiar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Baixar arquivo TSX"
            title="Baixar arquivo TSX"
            onClick={onDownload}
            disabled={!canUseCode}
            className="hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        {status ? <StatusMessage status={status} /> : null}

        <div className="min-w-0 overflow-hidden rounded-lg border bg-white text-slate-900 shadow-inner dark:bg-zinc-950 dark:text-zinc-100">
          <div className="flex items-center gap-2 border-b bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 min-w-0 truncate text-xs text-slate-500 dark:text-zinc-400">
              {fileName}
            </span>
          </div>
          <pre className="h-[420px] max-w-full overflow-auto p-3 text-xs leading-5 sm:h-[520px] sm:p-4 lg:h-[620px]">
            <code>{code || "// O componente TypeScript aparecerá aqui."}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
