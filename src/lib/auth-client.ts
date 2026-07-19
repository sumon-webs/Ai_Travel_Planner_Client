import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  fetchOptions: {
    credentials: "include",
  },
});



export const { signIn, signUp, signOut, useSession } = authClient;

/** Helper: returns the full absolute callbackURL for OAuth flows */
export function getOAuthCallbackURL(path = '/') {
  if (typeof window === 'undefined') return path;
  const base = window.location.origin;
  return `${base}${path}`;
}
