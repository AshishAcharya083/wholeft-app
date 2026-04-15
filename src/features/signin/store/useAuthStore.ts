import { create } from "zustand";
import { AuthUser } from "../entities";

export type AuthStatus = "unauthenticated" | "authenticating" | "authenticated";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;

  setAuthenticating: () => void;
  setAuthenticated: (user: AuthUser) => void;
  setError: (message: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "unauthenticated",
  error: null,

  setAuthenticating: () => set({ status: "authenticating", error: null }),
  setAuthenticated: (user) => set({ user, status: "authenticated", error: null }),
  setError: (message) => set({ status: "unauthenticated", error: message }),
  signOut: () => set({ user: null, status: "unauthenticated", error: null }),
}));

export const selectIsAuthenticated = (s: AuthState): boolean =>
  s.status === "authenticated" && s.user !== null;
export const selectAuthUser = (s: AuthState): AuthUser | null => s.user;
export const selectAuthStatus = (s: AuthState): AuthStatus => s.status;
export const selectAuthError = (s: AuthState): string | null => s.error;
