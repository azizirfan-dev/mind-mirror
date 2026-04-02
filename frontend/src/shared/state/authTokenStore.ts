import { getSession, useSession } from 'next-auth/react';

// For use in Axios interceptors and non-React contexts (client-side only)
export const getAuthToken = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.accessToken ?? null;
};

// For client components that need reactive token access
export const useAuthToken = (): string | null => {
  const { data: session } = useSession();
  return session?.accessToken ?? null;
};
