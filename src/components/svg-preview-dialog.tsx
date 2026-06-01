import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type SvgPreviewDialogProps = {
  previewSource: string;
};

export function SvgPreviewDialog({ previewSource }: SvgPreviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview do SVG
          </span>
          <span className="text-xs opacity-70">Abrir prévia</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview do SVG</DialogTitle>
          <DialogDescription>
            Prévia isolada em tamanho controlado para ícones, logos e
            ilustrações.
          </DialogDescription>
        </DialogHeader>
        <div className="grid h-[min(64vh,520px)] place-items-center overflow-hidden rounded-md border bg-[linear-gradient(45deg,hsl(var(--muted))_25%,transparent_25%),linear-gradient(-45deg,hsl(var(--muted))_25%,transparent_25%),linear-gradient(45deg,transparent_75%,hsl(var(--muted))_75%),linear-gradient(-45deg,transparent_75%,hsl(var(--muted))_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-4">
          {previewSource ? (
            <iframe
              title="Preview do SVG"
              sandbox=""
              srcDoc={previewSource}
              className="h-full w-full border-0"
            />
          ) : (
            <span className="text-center text-sm text-muted-foreground">
              Cole um SVG válido para visualizar.
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
