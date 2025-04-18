import { supabase } from "@/lib/supabaseClient";
import { DEFAULT_FLAT_ID } from "@/lib/constants";
import type { User } from "@supabase/supabase-js";

export async function hydrateUser(user: User) {
  console.log("[hydrateUser] user.id:", user.id);
  const { data: userProfile } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!userProfile) {
    console.log("[hydrateUser] inserting new user...");
    await createUser(user);
    await addUserToFlat(user.id);
  }
}

export async function createUser(user: User) {
  const name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Unnamed";
  console.log("[createUser] user.id:", { id: user.id, name });

  await supabase.from("users").insert({
    id: user.id,
    full_name: name,
  });
}

export async function addUserToFlat(userId: string) {
  console.log("[addUserToFlat] userId:", userId);
  await supabase.from("flat_members").insert({
    user_id: userId,
    flat_id: DEFAULT_FLAT_ID,
    role: "member",
  });
}
