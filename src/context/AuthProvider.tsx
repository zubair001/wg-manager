import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import { AuthContext } from "./auth-context";
import { hydrateUser } from "@/services/user.service";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { loginAndHydrateUser } from "@/services/auth.service";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSession = async (session: Session | null) => {
    const authUser = session?.user ?? null;
    setSession(session);
    setUser(authUser);

    if (authUser) {
      await hydrateUser(authUser);
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await handleSession(session);
      setIsLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error, session } = await loginAndHydrateUser(email, password);

    if (error) {
      logger.error("Login error:", error);
      toast.error(error.message || "Login failed.");
    } else {
      logger.info("Login successful");
      toast.success("Welcome back!");
    }

    return { error, session };
  };

  const signup = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{ session, user, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
