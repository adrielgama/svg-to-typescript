import { Check } from "lucide-react";

export type AppStatus = {
  type: "success" | "error";
  message: string;
};

type StatusMessageProps = {
  status: AppStatus;
};

export function StatusMessage({ status }: StatusMessageProps) {
  return (
    <div
      role={status.type === "success" ? "status" : "alert"}
      aria-live={status.type === "success" ? "polite" : "assertive"}
      className={
        status.type === "success"
          ? "flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
          : "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      }
    >
      {status.type === "success" ? <Check className="h-4 w-4" /> : null}
      <span>{status.message}</span>
    </div>
  );
}
