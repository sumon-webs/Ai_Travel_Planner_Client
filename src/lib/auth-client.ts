import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  /** Points to the Express backend where Better Auth is mounted */
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000',
});

export const { signIn, signUp, signOut, useSession } = authClient;
