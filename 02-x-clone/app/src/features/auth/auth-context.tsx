import type { Session, User } from "@supabase/supabase-js";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { supabaseClient } from "../../lib/supabase-client";

interface SignInInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  signInWithPassword: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabaseClient.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        if (isMounted) {
          setSession(data.session);
          setIsInitializing(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsInitializing(false);
        }
      });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsInitializing(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isInitializing,
      isAuthenticated: Boolean(session?.user),
      signInWithPassword: async ({ email, password }) => {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }
      },
      signOut: async () => {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
          throw error;
        }
      },
    }),
    [isInitializing, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
