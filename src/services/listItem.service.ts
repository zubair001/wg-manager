import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";

export async function fetchListItems(listId: string) {
  const { data, error } = await supabase
    .from("list_items")
    .select("*")
    .eq("list_id", listId)
    .order("created_at");

  if (error) {
    logger.error("Error fetching items", error);
    return [];
  }

  return data;
}

export async function addListItem(listId: string, text: string) {
  const { error } = await supabase
    .from("list_items")
    .insert({ list_id: listId, text });
  if (error) logger.error("Add item failed", error);
}

export async function deleteListItem(id: string) {
  const { error } = await supabase.from("list_items").delete().eq("id", id);
  if (error) logger.error("Delete item failed", error);
}

export async function toggleItemChecked(id: string, checked: boolean) {
  const { error } = await supabase
    .from("list_items")
    .update({ checked })
    .eq("id", id);
  if (error) logger.error("Toggle check failed", error);
}

export async function fetchCompletionCount(listId: string) {
  const { data, error } = await supabase
    .from("list_items")
    .select("checked")
    .eq("list_id", listId);

  if (error || !data) return { completed: 0, total: 0 };

  const total = data.length;
  const completed = data.filter((item) => item.checked).length;

  return { completed, total };
}
