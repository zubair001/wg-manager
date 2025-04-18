import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabaseClient";
import { useDashboardLists } from "@/store/useDashboardLists";
import { ListStatus } from "@/interfaces/types";

export async function checkAndArchiveIfAllDone(listId: string) {
  const { data: items, error: itemErr } = await supabase
    .from("list_items")
    .select("checked")
    .eq("list_id", listId);

  if (itemErr) {
    logger.error("Error fetching list items", itemErr);
    return;
  }

  const allChecked = items?.length > 0 && items.every((item) => item.checked);

  const { data: list, error: listErr } = await supabase
    .from("lists")
    .select("status")
    .eq("id", listId)
    .single();

  if (listErr || !list) {
    logger.error("Error fetching list metadata", listErr);
    return;
  }

  const dashboardStore = useDashboardLists.getState();

  // Archive if all checked and not already archived
  if (allChecked && list.status !== ListStatus.ARCHIVED) {
    const { error: archiveError } = await supabase
      .from("lists")
      .update({ status: ListStatus.ARCHIVED })
      .eq("id", listId);

    if (!archiveError) {
      logger.info(`List ${listId} archived`);
      dashboardStore.markDirty();
    }
  }

  // Unarchive if not all checked and list is archived
  if (!allChecked && list.status === ListStatus.ARCHIVED) {
    const { error: unarchiveError } = await supabase
      .from("lists")
      .update({ status: ListStatus.ACTIVE })
      .eq("id", listId);

    if (!unarchiveError) {
      logger.info(`List ${listId} unarchived`);
      dashboardStore.markDirty();
    }
  }
}
