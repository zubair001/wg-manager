import { z } from "zod";

export const listItemSchema = z.object({
  text: z.string().min(1, "Item text is required"),
});
