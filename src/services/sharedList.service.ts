import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export async function createSharedLink(listId: string): Promise<string | null> {

  //TODO: Remove existing shared links for the list

  const token = uuidv4();

  const { data, error } = await supabase
    .from("shared_links")
    .insert({ list_id: listId, token, editable: false })
    .select("token")
    .single();

  if (error) {
    toast.error("Failed to enable sharing.");
    return null;
  }

  toast.success("List is now shared.");
  return data.token;
}

export async function getExistingSharedToken(
  listId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("shared_links")
    .select("token")
    .eq("list_id", listId)
    .maybeSingle();

  if (error) return null;
  return data?.token ?? null;
}

export async function disablePublicShare(listId: string): Promise<boolean> {
  const { error } = await supabase
    .from("shared_links")
    .delete()
    .eq("list_id", listId);

  if (error) {
    toast.error("Failed to disable sharing.");
    return false;
  }

  toast.success("Sharing disabled.");
  return true;
}

export async function getListIdBySharedToken(token: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("shared_links")
      .select("list_id, expires_at")
      .eq("token", token)
      .maybeSingle();
  
    if (
      error ||
      !data ||
      (data.expires_at && new Date(data.expires_at) < new Date())
    ) {
      return null;
    }
  
    return data.list_id;
  }
