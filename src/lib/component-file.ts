export function getOutputFileName(componentName: string) {
  const normalized = componentName
    .trim()
    .replace(/[^a-zA-Z0-9_$]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  if (!normalized || !/^[A-Za-z_$]/.test(normalized)) {
    return "Component.tsx";
  }

  return `${normalized}.tsx`;
}
