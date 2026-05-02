import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidEmail(email: string) {
  return (
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )?.length === 1
  );
}

export function getHost() {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return "";
}

/** Defaults keep question body images readable without overflowing the layout */
const DEFAULT_IMG_MAX_WIDTH_PX = 448;
const DEFAULT_IMG_MAX_HEIGHT_PX = 320;

export type ResolveImagesOptions = {
  /** Max rendered width (px); also capped by container via min(100%, …) */
  maxWidthPx?: number;
  /** Max rendered height (px); preserves aspect ratio with object-fit: contain */
  maxHeightPx?: number;
};

function capImageDimensions(
  img: HTMLImageElement,
  maxWidthPx: number,
  maxHeightPx: number,
) {
  img.style.maxWidth = `min(100%, ${maxWidthPx}px)`;
  img.style.maxHeight = `${maxHeightPx}px`;
  img.style.width = "auto";
  img.style.height = "auto";
  img.style.objectFit = "contain";
}

export function resolveImages(
  html: string,
  question_id: string,
  options?: ResolveImagesOptions,
) {
  const maxWidthPx = options?.maxWidthPx ?? DEFAULT_IMG_MAX_WIDTH_PX;
  const maxHeightPx = options?.maxHeightPx ?? DEFAULT_IMG_MAX_HEIGHT_PX;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = doc.querySelectorAll("img");

  images.forEach((img) => {
    const src = img.getAttribute("src");
    if (!src) return;

    capImageDimensions(img, maxWidthPx, maxHeightPx);

    // Keep already-resolved or external sources untouched.
    if (
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("data:") ||
      src.startsWith("blob:") ||
      src.startsWith("/media/question_images/")
    ) {
      return;
    }

    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src;
    const filename = normalizedSrc.startsWith(`${question_id}_`)
      ? normalizedSrc
      : `${question_id}_${normalizedSrc}`;

    img.setAttribute("src", `${getHost()}/media/question_images/${filename}`);
  });
  return doc.body.innerHTML;
}