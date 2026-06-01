import { extractSvgMarkup } from "@/lib/svg-to-tsx";

export function getPreviewSource(svg: string) {
  const trimmed = extractSvgMarkup(svg);

  if (!isValidSvg(trimmed)) {
    return "";
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
</html>`;
}

function isValidSvg(svg: string) {
  if (!svg.startsWith("<svg")) {
    return false;
  }

  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  return (
    !doc.querySelector("parsererror") &&
    doc.documentElement.tagName.toLowerCase() === "svg"
  );
}
