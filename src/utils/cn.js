/**
 * File: cn.js
 * Purpose: Utility generator for Tailwind class merging.
 * Dependencies: clsx, tailwind-merge
 * Notes: Used by UI components to resolve class name conflicts.
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges standard CSS classes with Tailwind classes intelligently.
 * @param {...any} inputs - Class names or objects
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
