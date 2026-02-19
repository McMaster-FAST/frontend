import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes and removes line breaking elements from given HTML string, making it safe for inline rendering.
 * @param str 
 * @returns 
 */
export function cleanHtmlForInline(str: string) {
  return DOMPurify.sanitize(str, { FORBID_TAGS: ['br', 'p', 'div', 'img', 'ul', 'li'] });
}