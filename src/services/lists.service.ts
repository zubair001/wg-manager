import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { getDayMonthString, validate } from "@/lib/utils";
import {
  CreateListInput,
  ListData,
  ListStatus,
  ListVisibility,
} from "@/interfaces/types";
import { DEFAULT_FLAT_ID } from "@/lib/constants";
import { listArraySchema } from "@/schemas/list.schema";

export function filterListsByCategory(lists: ListData[], userId: string) {
  return {
    myLists: lists.filter(
      (list) =>
        list.owner_id === userId &&
        !list.is_template &&
        list.visibility === ListVisibility.PRIVATE
    ),
    sharedFlatLists: lists.filter(
      (list) => !list.is_template && list.visibility === ListVisibility.FLAT
    ),
    templateLists: lists.filter((list) => list.is_template),
  };
}

export async function createList(input: CreateListInput) {
  const {
    title,
    type,
    visibility,
    is_template = false,
    template_id = null,
    owner_id,
  } = input;

  const insertData = {
    title,
    type,
    visibility,
    owner_id,
    flat_id: visibility === "flat" ? DEFAULT_FLAT_ID : null,
    is_template,
    template_id,
    status: "active",
  };

  const { error } = await supabase.from("lists").insert(insertData);

  if (error) {
    logger.error("Failed to insert list", error);
  } else {
    logger.info("List created", insertData);
  }

  return { error };
}

export async function fetchLists(): Promise<ListData[]> {
  const { data, error } = await supabase
    .from("lists")
    .select(
      `
      *,
      users:owner_id (
        full_name
      )
    `
    )
    .eq("status", ListStatus.ACTIVE)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Error fetching lists", error);
    return [];
  }

  const validatedLists = validate(listArraySchema, data);
  if (!validatedLists) return [];

  const mapped: ListData[] = (data ?? []).map((list) => ({
    ...list,
    owner_name: list.users?.full_name ?? "Unknown",
  }));

  logger.info("Fetched user lists:", mapped);
  return mapped;
}

export async function fetchListById(listId: string) {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("id", listId)
    .single();

  if (error) {
    logger.error(`Failed to fetch list ${listId}`, error);
    return null;
  }
  logger.info("Fetched single list", data);
  return data;
}

export async function deleteListById(id: string) {
  let error = null;

  const listData = await fetchListById(id);
  if (!listData) {
    toast.error("List not found.");
    logger.error("List not found", { id });
    return;
  }
  if (listData.is_template) {
    const { error: updateError } = await supabase
      .from("lists")
      .update({ status: ListStatus.INACTIVE })
      .eq("id", id);

    error = updateError;
  } else {
    const { error: deleteError } = await supabase
      .from("lists")
      .delete()
      .eq("id", id);

    error = deleteError;
  }
  if (error) {
    logger.error("Error deleting list", error);
    toast.error("Failed to delete list.");
  } else {
    logger.info("List deleted", { id });
    toast.success("List deleted successfully.");
  }
}

export async function copyTemplate(listId: string, userId: string) {
  const { data: template, error: listErr } = await supabase
    .from("lists")
    .select("title, type")
    .eq("id", listId)
    .eq("is_template", true)
    .single();

  if (listErr || !template) {
    toast.error("Template not found.");
    return;
  }

  const newTitle = `${template.title} (${getDayMonthString()})`;

  const { data: newList, error: createErr } = await supabase
    .from("lists")
    .insert({
      user_id: userId,
      title: newTitle,
      type: template.type,
      is_template: false,
      status: ListStatus.ACTIVE,
      is_shared_public: false,
    })
    .select()
    .single();

  if (createErr || !newList) {
    toast.error("Failed to create list from template.");
    return;
  }

  const { data: items } = await supabase
    .from("list_items")
    .select("text, checked")
    .eq("list_id", listId);

  const newItems = items?.map((item) => ({
    list_id: newList.id,
    text: item.text,
    checked: false,
  }));

  if (newItems && newItems.length) {
    await supabase.from("list_items").insert(newItems);
  }

  toast.success("Template activated as new list.");
  return newList.id;
}

export async function fetchArchivedLists() {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("status", ListStatus.ARCHIVED)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((list) => ({
    ...list,
    type: list.type as "todo" | "grocery",
  }));
}

export async function fetchTemplates(): Promise<ListData[]> {
  const { data, error } = await supabase
    .from("lists")
    .select("id, title, type, status")
    .eq("is_template", true)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Error fetching templates", error);
    return [];
  }

  logger.info("Fetched templates", data);
  return data as ListData[];
}

export async function updateListById(id: string, updates: Partial<ListData>) {
  return await supabase.from("lists").update(updates).eq("id", id);
}
