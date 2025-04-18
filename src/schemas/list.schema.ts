import { z } from "zod";
import { ERROR } from "@/lib/constants";

const ListTypeEnum = z.enum(["todo", "grocery"], {
  errorMap: () => ({ message: ERROR.invalidType }),
});

const VisibilityEnum = z.enum(["private", "public", "flat"]);

export const listFormSchema = z.object({
  title: z.string().min(1, ERROR.requiredTitle),
  type: ListTypeEnum,
  visibility: VisibilityEnum,
  is_template: z.boolean().optional(),
});

export const listSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: ListTypeEnum,
  visibility: VisibilityEnum,
  is_template: z.boolean(),
  template_id: z.string().nullable(),
  owner_id: z.string(),
  flat_id: z.string().nullable(),
  status: z.enum(["active", "inactive", "archived"]),
  created_at: z.string(),
  updated_at: z.string().optional(),
  users: z
    .object({
      full_name: z.string().nullable(),
    })
    .optional(),
});

export const listArraySchema = z.array(listSchema);
export type List = z.infer<typeof listSchema>;
