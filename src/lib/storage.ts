import { SVG_STORAGE_KEY } from "@/constants/svg";

export function readStoredSvg() {
  try {
    return localStorage.getItem(SVG_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveStoredSvg(svg: string) {
  try {
    localStorage.setItem(SVG_STORAGE_KEY, svg);
  } catch {
    return;
  }
}

export function removeStoredSvg() {
  try {
    localStorage.removeItem(SVG_STORAGE_KEY);
  } catch {
    return;
  }
}
