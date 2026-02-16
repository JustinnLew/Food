import { useEffect, useMemo, useState, type ReactNode } from "react";
import supabase from "./Supabase";
import type { Session } from "@supabase/supabase-js";
import { SessionContext, type SessionContextType } from "./SessionContext";

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Just in case verify the session against the db
      if (session) {
        const { data, error } = await supabase.auth.getClaims();

        if (error || !data) {
          setSession(null);
        } else {
          setSession(session);
        }
      }
      setLoading(false);
    };

    initAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: SessionContextType = useMemo(
    () => ({
      signIn,
      signOut,
      signUp,
      loading,
      session,
    }),
    [loading, session],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
