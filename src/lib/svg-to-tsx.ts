export type ExportStyle = "default-function" | "const-default" | "named-const"

export type ConversionOptions = {
  componentName: string
  exportStyle: ExportStyle
  includeClassName: boolean
  includeProps: boolean
  useCurrentColor: boolean
}

export type ConversionResult =
  | { ok: true; code: string; error?: never }
  | { ok: false; code: string; error: string }

export type FormatResult =
  | { ok: true; svg: string; error?: never }
  | { ok: false; svg: string; error: string }

const SAMPLE_CODE = `export default function BellIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}`

const NUMERIC_ATTRIBUTES = new Set([
  "cx",
  "cy",
  "dx",
  "dy",
  "height",
  "opacity",
  "r",
  "rx",
  "ry",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "width",
  "x",
  "x1",
  "x2",
  "y",
  "y1",
  "y2",
])

const COLOR_ATTRIBUTES = new Set(["color", "fill", "stroke", "stopColor", "floodColor", "lightingColor"])

const SVG_NAME_FIXES: Record<string, string> = {
  clippath: "clipPath",
  feblend: "feBlend",
  fecolormatrix: "feColorMatrix",
  fecomponenttransfer: "feComponentTransfer",
  fecomposite: "feComposite",
  feconvolvematrix: "feConvolveMatrix",
  fediffuselighting: "feDiffuseLighting",
  fedisplacementmap: "feDisplacementMap",
  fedistantlight: "feDistantLight",
  fedropshadow: "feDropShadow",
  feflood: "feFlood",
  fefunca: "feFuncA",
  fefuncb: "feFuncB",
  fefuncg: "feFuncG",
  fefuncr: "feFuncR",
  fegaussianblur: "feGaussianBlur",
  feimage: "feImage",
  femerge: "feMerge",
  femergenode: "feMergeNode",
  femorphology: "feMorphology",
  feoffset: "feOffset",
  fepointlight: "fePointLight",
  fespecularlighting: "feSpecularLighting",
  fespotlight: "feSpotLight",
  fetile: "feTile",
  feturbulence: "feTurbulence",
  lineargradient: "linearGradient",
  radialgradient: "radialGradient",
  textpath: "textPath",
}

export function convertSvgToTsx(input: string, options: ConversionOptions): ConversionResult {
  if (!input.trim()) {
    return { ok: false, code: "", error: "Cole um SVG para gerar o componente." }
  }

  const normalizedInput = extractSvgMarkup(input)

  if (!normalizedInput) {
    return {
      ok: false,
      code: "",
      error: "Entrada inválida. O código precisa conter um elemento <svg>.",
    }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(normalizedInput, "image/svg+xml")
  const parseError = doc.querySelector("parsererror")

  if (parseError) {
    return {
      ok: false,
      code: "",
      error: "SVG inválido. Verifique se o código contém uma tag <svg> bem formada.",
    }
  }

  const svg = doc.documentElement

  if (!svg || svg.tagName.toLowerCase() !== "svg") {
    return {
      ok: false,
      code: "",
      error: "Entrada inválida. O código precisa começar por um elemento <svg>.",
    }
  }

  const componentName = normalizeComponentName(options.componentName)
  const svgCode = renderElement(svg, options, 2, true)
  const code = wrapComponent(svgCode, componentName, options)

  return { ok: true, code }
}

export function getSampleCode() {
  return SAMPLE_CODE
}

export function formatSvg(input: string): FormatResult {
  if (!input.trim()) {
    return { ok: false, svg: input, error: "Cole um SVG para formatar." }
  }

  const normalizedInput = extractSvgMarkup(input)

  if (!normalizedInput) {
    return {
      ok: false,
      svg: input,
      error: "Entrada inválida. O código precisa conter um elemento <svg>.",
    }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(normalizedInput, "image/svg+xml")
  const parseError = doc.querySelector("parsererror")

  if (parseError || doc.documentElement.tagName.toLowerCase() !== "svg") {
    return {
      ok: false,
      svg: input,
      error: "SVG inválido. Corrija a estrutura antes de formatar.",
    }
  }

  return {
    ok: true,
    svg: renderSvgMarkup(doc.documentElement, 0),
  }
}

function wrapComponent(svgCode: string, componentName: string, options: ConversionOptions) {
  const params = getParams(options)

  if (options.exportStyle === "default-function") {
    return `export default function ${componentName}(${params}) {
  return (
${svgCode}
  )
}`
  }

  if (options.exportStyle === "const-default") {
    return `const ${componentName} = (${params}) => (
${svgCode}
)

export default ${componentName}`
  }

  return `export const ${componentName} = (${params}) => (
${svgCode}
)`
}

function getParams(options: ConversionOptions) {
  if (options.includeClassName && options.includeProps) {
    return `{
  className,
  ...props
}: React.SVGProps<SVGSVGElement>`
  }

  if (options.includeClassName) {
    return `{
  className
}: React.SVGProps<SVGSVGElement>`
  }

  if (options.includeProps) {
    return "props: React.SVGProps<SVGSVGElement>"
  }

  return ""
}

function renderElement(element: Element, options: ConversionOptions, depth: number, isRoot = false): string {
  const indent = "  ".repeat(depth)
  const childIndent = "  ".repeat(depth + 1)
  const tagName = normalizeTagName(element.tagName)
  const attributes = getAttributes(element, options, isRoot)
  const children = Array.from(element.childNodes)
    .filter((node) => node.nodeType !== Node.COMMENT_NODE)
    .map((node) => renderNode(node, options, depth + 1))
    .filter(Boolean)

  const attrLines = attributes.map((attribute) => `${childIndent}${attribute}`)

  if (children.length === 0) {
    if (attrLines.length === 0) {
      return `${indent}<${tagName} />`
    }

    return [`${indent}<${tagName}`, ...attrLines, `${indent}/> `].join("\n").replace(" /> ", " />")
  }

  if (attrLines.length === 0) {
    return [`${indent}<${tagName}>`, ...children, `${indent}</${tagName}>`].join("\n")
  }

  return [`${indent}<${tagName}`, ...attrLines, `${indent}>`, ...children, `${indent}</${tagName}>`].join("\n")
}

function renderNode(node: ChildNode, options: ConversionOptions, depth: number): string {
  if (node.nodeType === Node.ELEMENT_NODE) {
    return renderElement(node as Element, options, depth)
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.replace(/\s+/g, " ").trim()
    return text ? `${"  ".repeat(depth)}{${JSON.stringify(text)}}` : ""
  }

  return ""
}

function getAttributes(element: Element, options: ConversionOptions, isRoot: boolean) {
  const attributes = Array.from(element.attributes)
    .filter((attribute) => !attribute.name.startsWith("xmlns"))
    .map((attribute) => formatAttribute(attribute.name, attribute.value, options))

  if (isRoot && options.includeClassName) {
    attributes.push("className={className}")
  }

  if (isRoot && options.includeProps) {
    attributes.push("{...props}")
  }

  return attributes
}

function formatAttribute(name: string, rawValue: string, options: ConversionOptions) {
  const jsxName = toJsxAttributeName(name)
  const value = shouldUseCurrentColor(jsxName, rawValue, options.useCurrentColor)
    ? "currentColor"
    : rawValue

  if (jsxName === "style") {
    return `${jsxName}=${JSON.stringify(value)}`
  }

  if (NUMERIC_ATTRIBUTES.has(jsxName) && /^-?\d+(\.\d+)?$/.test(value)) {
    return `${jsxName}={${value}}`
  }

  return `${jsxName}=${JSON.stringify(value)}`
}

function shouldUseCurrentColor(name: string, value: string, enabled: boolean) {
  if (!enabled || !COLOR_ATTRIBUTES.has(name)) {
    return false
  }

  const normalized = value.trim().toLowerCase()
  return Boolean(normalized && normalized !== "none" && normalized !== "transparent" && !normalized.startsWith("url("))
}

function toJsxAttributeName(name: string) {
  if (name === "class") {
    return "className"
  }

  return name.replace(/[:-]([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function normalizeTagName(tagName: string) {
  const lowerTag = tagName.toLowerCase()
  return SVG_NAME_FIXES[lowerTag] ?? lowerTag
}

function normalizeComponentName(name: string) {
  const cleaned = name
    .trim()
    .replace(/[^a-zA-Z0-9_$]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

  const fallback = cleaned || "SvgIcon"
  return /^[A-Za-z_$]/.test(fallback) ? fallback : `Svg${fallback}`
}

export function extractSvgMarkup(input: string) {
  const match = input.match(/<svg\b[\s\S]*<\/svg>/i)
  return match?.[0].trim() ?? ""
}

function renderSvgMarkup(element: Element, depth: number): string {
  const indent = "  ".repeat(depth)
  const childIndent = "  ".repeat(depth + 1)
  const tagName = normalizeTagName(element.tagName)
  const attributes = Array.from(element.attributes).map(
    (attribute) => `${attribute.name}=${JSON.stringify(attribute.value)}`,
  )
  const children = Array.from(element.childNodes)
    .filter((node) => node.nodeType !== Node.COMMENT_NODE)
    .map((node) => renderSvgNode(node, depth + 1))
    .filter(Boolean)

  if (children.length === 0) {
    if (attributes.length === 0) {
      return `${indent}<${tagName} />`
    }

    return [`${indent}<${tagName}`, ...attributes.map((attribute) => `${childIndent}${attribute}`), `${indent}/> `]
      .join("\n")
      .replace(" /> ", " />")
  }

  if (attributes.length === 0) {
    return [`${indent}<${tagName}>`, ...children, `${indent}</${tagName}>`].join("\n")
  }

  return [
    `${indent}<${tagName}`,
    ...attributes.map((attribute) => `${childIndent}${attribute}`),
    `${indent}>`,
    ...children,
    `${indent}</${tagName}>`,
  ].join("\n")
}

function renderSvgNode(node: ChildNode, depth: number): string {
  if (node.nodeType === Node.ELEMENT_NODE) {
    return renderSvgMarkup(node as Element, depth)
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.replace(/\s+/g, " ").trim()
    return text ? `${"  ".repeat(depth)}${escapeText(text)}` : ""
  }

  return ""
}

function escapeText(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
