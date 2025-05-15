
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to compose class names together in a typesafe way
 * This combines clsx for conditional classes and tailwind-merge for Tailwind CSS compatibility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
