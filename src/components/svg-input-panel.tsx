import { RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OptionSwitch } from "@/components/option-switch";
import { SvgPreviewDialog } from "@/components/svg-preview-dialog";
import type { ExportStyle } from "@/lib/svg-to-tsx";

type SvgInputPanelProps = {
  componentName: string;
  exportStyle: ExportStyle;
  includeClassName: boolean;
  includeProps: boolean;
  previewSource: string;
  svgInput: string;
  useCurrentColor: boolean;
  onClear: () => void;
  onComponentNameChange: (value: string) => void;
  onExportStyleChange: (value: ExportStyle) => void;
  onIncludeClassNameChange: (checked: boolean) => void;
  onIncludePropsChange: (checked: boolean) => void;
  onPrettify: () => void;
  onRestoreExample: () => void;
  onSvgInputChange: (value: string) => void;
  onUseCurrentColorChange: (checked: boolean) => void;
};

export function SvgInputPanel({
  componentName,
  exportStyle,
  includeClassName,
  includeProps,
  previewSource,
  svgInput,
  useCurrentColor,
  onClear,
  onComponentNameChange,
  onExportStyleChange,
  onIncludeClassNameChange,
  onIncludePropsChange,
  onPrettify,
  onRestoreExample,
  onSvgInputChange,
  onUseCurrentColorChange,
}: SvgInputPanelProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/95 shadow-none shadow-black/5">
      <CardHeader className="p-4 sm:p-5">
        <CardTitle className="text-xl">Entrada</CardTitle>
        <CardDescription>
          Cole o SVG original e ajuste as opções do componente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="grid gap-4 rounded-lg border bg-muted/30 p-3 sm:p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="component-name">Nome do componente</Label>
              <Input
                id="component-name"
                value={componentName}
                onChange={(event) =>
                  onComponentNameChange(event.target.value)
                }
                placeholder="BellIcon"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="export-style">Tipo de exportação</Label>
              <Select
                value={exportStyle}
                onValueChange={(value) =>
                  onExportStyleChange(value as ExportStyle)
                }
              >
                <SelectTrigger id="export-style" className="min-w-0">
                  <SelectValue placeholder="Escolha o tipo de exportação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default-function">
                    export default function NomeIcon
                  </SelectItem>
                  <SelectItem value="const-default">
                    const NomeIcon + export default
                  </SelectItem>
                  <SelectItem value="named-const">
                    export const NomeIcon
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <OptionSwitch
              checked={useCurrentColor}
              id="current-color"
              label="currentColor"
              onCheckedChange={onUseCurrentColorChange}
            />
            <OptionSwitch
              checked={includeProps}
              id="include-props"
              label="{...props}"
              onCheckedChange={onIncludePropsChange}
            />
            <OptionSwitch
              checked={includeClassName}
              id="include-classname"
              label="className"
              onCheckedChange={onIncludeClassNameChange}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-3 py-2">
            <Label htmlFor="svg-input" className="font-semibold">
              SVG original
            </Label>
            <Button type="button" variant="secondary" size="sm" onClick={onPrettify}>
              <Sparkles className="h-4 w-4" />
              Prettier
            </Button>
          </div>
          <Textarea
            id="svg-input"
            value={svgInput}
            onChange={(event) => onSvgInputChange(event.target.value)}
            spellCheck={false}
            className="h-[420px] resize-none rounded-none border-0 bg-transparent font-mono text-xs leading-5 shadow-none focus-visible:ring-0 sm:h-[520px] lg:h-[420px]"
          />
        </div>

        <SvgPreviewDialog previewSource={previewSource} />

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onClear}>
            <Trash2 className="h-4 w-4" />
            Limpar
          </Button>
          <Button type="button" variant="secondary" onClick={onRestoreExample}>
            <RotateCcw className="h-4 w-4" />
            Exemplo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
