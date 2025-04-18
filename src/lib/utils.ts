import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { logger } from "./logger";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getDayMonthString(date: Date = new Date()): string {
  const formatted = date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
  return formatted.replace(/\.$/, "");
}

export function validate<T>(schema: z.ZodType<T>, data: unknown): T | null {
  const result = schema.safeParse(data);

  if (!result.success) {
    logger.error("Zod validation failed", result.error.format());
    toast.error("Invalid data received from server.");
    return null;
  }

  return result.data;
}