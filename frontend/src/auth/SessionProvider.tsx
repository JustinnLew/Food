import { useEffect, useMemo, useState, type ReactNode } from "react";
import supabase from "./Supabase";
import type { Session } from "@supabase/supabase-js";
import { SessionContext, type SessionContextType } from "./SessionContext";

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    setLoading(false);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: SessionContextType = useMemo(() => ({
    signIn,
    signOut,
    loading,
    session
  }), [loading, session]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
