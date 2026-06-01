import { useDeferredValue, useMemo, useState } from "react"
import { Check, Clipboard, Eye, EyeOff, Heart, Moon, RotateCcw, Sparkles, Sun, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ThemeProvider } from "@/components/theme-provider"
import { type ExportStyle, convertSvgToTsx, formatSvg } from "@/lib/svg-to-tsx"

const DEFAULT_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
</svg>`

const SVG_STORAGE_KEY = "svg-to-typescript:svg-input"

function SvgToTypescriptApp() {
  const [svgInput, setSvgInput] = useState(() => readStoredSvg() ?? DEFAULT_SVG)
  const [componentName, setComponentName] = useState("BellIcon")
  const [useCurrentColor, setUseCurrentColor] = useState(true)
  const [includeProps, setIncludeProps] = useState(true)
  const [includeClassName, setIncludeClassName] = useState(true)
  const [exportStyle, setExportStyle] = useState<ExportStyle>("default-function")
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const deferredSvgInput = useDeferredValue(svgInput)

  const conversion = useMemo(
    () =>
      convertSvgToTsx(deferredSvgInput, {
        componentName,
        exportStyle,
        includeClassName,
        includeProps,
        useCurrentColor,
      }),
    [componentName, deferredSvgInput, exportStyle, includeClassName, includeProps, useCurrentColor],
  )

  const generatedCode = conversion.ok ? conversion.code : ""
  const previewSource = useMemo(() => getPreviewSource(deferredSvgInput), [deferredSvgInput])

  const validationStatus =
    !conversion.ok || !svgInput.trim()
      ? { type: "error" as const, message: conversion.error || "Cole um SVG para gerar o componente." }
      : null
  const visibleStatus = status ?? validationStatus

  async function copyCode() {
    if (!conversion.ok || !generatedCode) {
      setStatus({ type: "error", message: conversion.error || "Não há código válido para copiar." })
      return
    }

    try {
      await navigator.clipboard.writeText(generatedCode)
      setStatus({ type: "success", message: "Código copiado para a área de transferência." })
    } catch {
      setStatus({ type: "error", message: "Não foi possível copiar. Verifique a permissão do navegador." })
    }
  }

  function clearInput() {
    setSvgInput("")
    removeStoredSvg()
    setStatus({ type: "success", message: "Entrada limpa." })
  }

  function restoreExample() {
    setSvgInput(DEFAULT_SVG)
    saveStoredSvg(DEFAULT_SVG)
    setComponentName("BellIcon")
    setStatus(null)
  }

  function prettifySvgInput() {
    const formatted = formatSvg(svgInput)

    if (!formatted.ok) {
      setStatus({ type: "error", message: formatted.error })
      return
    }

    setSvgInput(formatted.svg)
    saveStoredSvg(formatted.svg)
    setStatus({ type: "success", message: "SVG formatado." })
  }

  function updateSvgInput(value: string) {
    setSvgInput(value)
    setStatus(null)

    if (value.trim()) {
      saveStoredSvg(value)
      return
    }

    removeStoredSvg()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">SVG to TypeScript</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Converta SVG em componente React tipado, sem backend.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <a href="https://ko-fi.com/adrielgama" target="_blank" rel="noopener noreferrer">
                <Heart className="h-4 w-4" />
                Doar
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Alternar tema"
              title="Alternar tema"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:block" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-6">
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entrada</CardTitle>
              <CardDescription>Cole o SVG original e ajuste as opções do componente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="component-name">Nome do componente</Label>
                <Input
                  id="component-name"
                  value={componentName}
                  onChange={(event) => {
                    setComponentName(event.target.value)
                    setStatus(null)
                  }}
                  placeholder="BellIcon"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="export-style">Tipo de exportação</Label>
                <Select
                  value={exportStyle}
                  onValueChange={(value) => {
                    setExportStyle(value as ExportStyle)
                    setStatus(null)
                  }}
                >
                  <SelectTrigger id="export-style">
                    <SelectValue placeholder="Escolha o tipo de exportação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default-function">export default function NomeIcon</SelectItem>
                    <SelectItem value="const-default">const NomeIcon + export default</SelectItem>
                    <SelectItem value="named-const">export const NomeIcon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3 rounded-md border p-3">
                <OptionSwitch
                  checked={useCurrentColor}
                  id="current-color"
                  label="Usar currentColor"
                  onCheckedChange={(checked) => {
                    setUseCurrentColor(checked)
                    setStatus(null)
                  }}
                />
                <OptionSwitch
                  checked={includeProps}
                  id="include-props"
                  label="Incluir {...props}"
                  onCheckedChange={(checked) => {
                    setIncludeProps(checked)
                    setStatus(null)
                  }}
                />
                <OptionSwitch
                  checked={includeClassName}
                  id="include-classname"
                  label="Incluir className"
                  onCheckedChange={(checked) => {
                    setIncludeClassName(checked)
                    setStatus(null)
                  }}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="svg-input">SVG original</Label>
                  <Button type="button" variant="outline" size="sm" onClick={prettifySvgInput}>
                    <Sparkles className="h-4 w-4" />
                    Prettier
                  </Button>
                </div>
                <Textarea
                  id="svg-input"
                  value={svgInput}
                  onChange={(event) => {
                    updateSvgInput(event.target.value)
                  }}
                  spellCheck={false}
                  className="min-h-[360px] resize-y font-mono text-xs leading-5"
                />
              </div>

              <div className="rounded-md border">
                <button
                  type="button"
                  aria-controls="svg-preview-panel"
                  aria-expanded={showPreview}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-medium"
                  onClick={() => setShowPreview((current) => !current)}
                >
                  <span>Preview</span>
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {showPreview ? (
                  <div id="svg-preview-panel" className="border-t bg-muted/40 p-3">
                    <div className="grid h-56 place-items-center overflow-hidden rounded-md border bg-background p-4">
                      {previewSource ? (
                        <iframe
                          title="Preview do SVG"
                          sandbox=""
                          srcDoc={previewSource}
                          className="h-full w-full border-0"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">Cole um SVG válido para visualizar.</span>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={clearInput}>
                  <Trash2 className="h-4 w-4" />
                  Limpar
                </Button>
                <Button type="button" variant="secondary" onClick={restoreExample}>
                  <RotateCcw className="h-4 w-4" />
                  Exemplo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <Card className="h-full">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div>
                <CardTitle>Componente gerado</CardTitle>
                <CardDescription>Atualizado automaticamente conforme a entrada e as opções.</CardDescription>
              </div>
              <Button type="button" onClick={copyCode} disabled={!conversion.ok || !generatedCode}>
                <Clipboard className="h-4 w-4" />
                Copiar
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {visibleStatus ? (
                <div
                  role={visibleStatus.type === "success" ? "status" : "alert"}
                  aria-live={visibleStatus.type === "success" ? "polite" : "assertive"}
                  className={
                    visibleStatus.type === "success"
                      ? "flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
                      : "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  }
                >
                  {visibleStatus.type === "success" ? <Check className="h-4 w-4" /> : null}
                  <span>{visibleStatus.message}</span>
                </div>
              ) : null}

              <pre className="min-h-[520px] overflow-auto rounded-md border bg-muted p-4 text-xs leading-5 text-foreground">
                <code>{generatedCode || "// O componente TypeScript aparecerá aqui."}</code>
              </pre>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-muted-foreground lg:px-6">
          Desenvolvido por{" "}
          <a
            href="https://adrielgama.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            adrielgama.dev
          </a>
        </div>
      </footer>
    </div>
  )
}

function getPreviewSource(svg: string) {
  const trimmed = svg.trim()

  if (!isValidSvg(trimmed)) {
    return ""
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline';" />
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
      }

      body {
        display: grid;
        place-items: center;
        background: transparent;
      }

      svg {
        display: block;
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
    </style>
  </head>
  <body>${trimmed}</body>
</html>`
}

function isValidSvg(svg: string) {
  if (!svg.startsWith("<svg")) {
    return false
  }

  const doc = new DOMParser().parseFromString(svg, "image/svg+xml")
  return !doc.querySelector("parsererror") && doc.documentElement.tagName.toLowerCase() === "svg"
}

function readStoredSvg() {
  try {
    return localStorage.getItem(SVG_STORAGE_KEY)
  } catch {
    return null
  }
}

function saveStoredSvg(svg: string) {
  try {
    localStorage.setItem(SVG_STORAGE_KEY, svg)
  } catch {
    return
  }
}

function removeStoredSvg() {
  try {
    localStorage.removeItem(SVG_STORAGE_KEY)
  } catch {
    return
  }
}

type OptionSwitchProps = {
  checked: boolean
  id: string
  label: string
  onCheckedChange: (checked: boolean) => void
}

function OptionSwitch({ checked, id, label, onCheckedChange }: OptionSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SvgToTypescriptApp />
    </ThemeProvider>
  )
}
