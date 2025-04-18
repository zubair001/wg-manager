import { supabase } from "@/lib/supabaseClient";
import { hydrateUser } from "./user.service";


export async function signupWithEmailConfirmation(
  email: string,
  password: string,
  fullName: string
) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  return { error };
}

export async function loginAndHydrateUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const session = data?.session;
  const user = session?.user;

  if (user) {
    await hydrateUser(user);
  }

  return { error, session };
}

