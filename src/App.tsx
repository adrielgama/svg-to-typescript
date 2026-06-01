import { useDeferredValue, useMemo, useState } from "react";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { GeneratedCodePanel } from "@/components/generated-code-panel";
import { SvgInputPanel } from "@/components/svg-input-panel";
import { ThemeProvider } from "@/components/theme-provider";
import { DEFAULT_SVG } from "@/constants/svg";
import { getOutputFileName } from "@/lib/component-file";
import { getPreviewSource } from "@/lib/svg-preview";
import {
  removeStoredSvg,
  readStoredSvg,
  saveStoredSvg,
} from "@/lib/storage";
import {
  type ConversionResult,
  type ExportStyle,
  convertSvgToTsx,
  formatSvg,
} from "@/lib/svg-to-tsx";
import type { AppStatus } from "@/components/status-message";

function SvgToTypescriptApp() {
  const [svgInput, setSvgInput] = useState(
    () => readStoredSvg() ?? DEFAULT_SVG,
  );
  const [componentName, setComponentName] = useState("BellIcon");
  const [useCurrentColor, setUseCurrentColor] = useState(true);
  const [includeProps, setIncludeProps] = useState(true);
  const [includeClassName, setIncludeClassName] = useState(true);
  const [exportStyle, setExportStyle] =
    useState<ExportStyle>("default-function");
  const [status, setStatus] = useState<AppStatus | null>(null);
  const deferredSvgInput = useDeferredValue(svgInput);

  const conversion = useMemo(
    () =>
      convertSvgToTsx(deferredSvgInput, {
        componentName,
        exportStyle,
        includeClassName,
        includeProps,
        useCurrentColor,
      }),
    [
      componentName,
      deferredSvgInput,
      exportStyle,
      includeClassName,
      includeProps,
      useCurrentColor,
    ],
  );

  const generatedCode = conversion.ok ? conversion.code : "";
  const outputFileName = getOutputFileName(componentName);
  const previewSource = useMemo(
    () => getPreviewSource(deferredSvgInput),
    [deferredSvgInput],
  );
  const visibleStatus = status ?? getValidationStatus(svgInput, conversion);

  function updateSvgInput(value: string) {
    setSvgInput(value);
    setStatus(null);

    if (value.trim()) {
      saveStoredSvg(value);
      return;
    }

    removeStoredSvg();
  }

  function updateComponentName(value: string) {
    setComponentName(value);
    setStatus(null);
  }

  function updateExportStyle(value: ExportStyle) {
    setExportStyle(value);
    setStatus(null);
  }

  function updateCurrentColor(checked: boolean) {
    setUseCurrentColor(checked);
    setStatus(null);
  }

  function updateIncludeProps(checked: boolean) {
    setIncludeProps(checked);
    setStatus(null);
  }

  function updateIncludeClassName(checked: boolean) {
    setIncludeClassName(checked);
    setStatus(null);
  }

  function clearInput() {
    setSvgInput("");
    removeStoredSvg();
    setStatus({ type: "success", message: "Entrada limpa." });
  }

  function restoreExample() {
    setSvgInput(DEFAULT_SVG);
    saveStoredSvg(DEFAULT_SVG);
    setComponentName("BellIcon");
    setStatus(null);
  }

  function prettifySvgInput() {
    const formatted = formatSvg(svgInput);

    if (!formatted.ok) {
      setStatus({ type: "error", message: formatted.error });
      return;
    }

    setSvgInput(formatted.svg);
    saveStoredSvg(formatted.svg);
    setStatus({ type: "success", message: "SVG formatado." });
  }

  async function copyCode() {
    if (!conversion.ok || !generatedCode) {
      setStatus({
        type: "error",
        message: conversion.error || "Não há código válido para copiar.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedCode);
      setStatus({
        type: "success",
        message: "Código copiado para a área de transferência.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Não foi possível copiar. Verifique a permissão do navegador.",
      });
    }
  }

  function downloadCode() {
    if (!conversion.ok || !generatedCode) {
      setStatus({
        type: "error",
        message: conversion.error || "Não há código válido para baixar.",
      });
      return;
    }

    const blob = new Blob([generatedCode], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = outputFileName;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus({
      type: "success",
      message: `Arquivo ${outputFileName} baixado.`,
    });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.09),transparent_30rem),linear-gradient(180deg,hsl(var(--muted)/0.7),hsl(var(--background))_22rem)] text-foreground">
      <AppHeader />

      <main className="mx-auto grid max-w-7xl gap-5 px-3 py-4 sm:px-4 sm:py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-6">
        <section className="min-w-0 space-y-4">
          <SvgInputPanel
            componentName={componentName}
            exportStyle={exportStyle}
            includeClassName={includeClassName}
            includeProps={includeProps}
            previewSource={previewSource}
            svgInput={svgInput}
            useCurrentColor={useCurrentColor}
            onClear={clearInput}
            onComponentNameChange={updateComponentName}
            onExportStyleChange={updateExportStyle}
            onIncludeClassNameChange={updateIncludeClassName}
            onIncludePropsChange={updateIncludeProps}
            onPrettify={prettifySvgInput}
            onRestoreExample={restoreExample}
            onSvgInputChange={updateSvgInput}
            onUseCurrentColorChange={updateCurrentColor}
          />
        </section>

        <section className="min-w-0 space-y-4">
          <GeneratedCodePanel
            canUseCode={conversion.ok && Boolean(generatedCode)}
            code={generatedCode}
            fileName={outputFileName}
            status={visibleStatus}
            onCopy={copyCode}
            onDownload={downloadCode}
          />
        </section>
      </main>

      <AppFooter />
    </div>
  );
}

function getValidationStatus(
  svgInput: string,
  conversion: ConversionResult,
): AppStatus | null {
  if (conversion.ok && svgInput.trim()) {
    return null;
  }

  return {
    type: "error",
    message: conversion.error || "Cole um SVG para gerar o componente.",
  };
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SvgToTypescriptApp />
    </ThemeProvider>
  );
}
