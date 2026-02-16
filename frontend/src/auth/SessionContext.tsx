import type { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export interface SessionContextType {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  session: Session | null;
}

export const SessionContext = createContext<SessionContextType | null>(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
