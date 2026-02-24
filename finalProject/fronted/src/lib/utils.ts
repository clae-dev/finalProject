/**
 * 유틸리티 함수 모음 - Tailwind CSS 클래스 병합 (cn)
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
