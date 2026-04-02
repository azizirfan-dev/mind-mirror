import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

interface BackendUser {
  id: string;
  email: string;
  name?: string | null;
}

interface BackendLoginResponse {
  success: boolean;
  data: {
    access_token: string;
    user: BackendUser;
  };
}

const fetchBackendLogin = async (email: string, password: string): Promise<BackendLoginResponse | null> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return null;
  return res.json() as Promise<BackendLoginResponse>;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const result = await fetchBackendLogin(credentials.email, credentials.password);
        if (!result?.success || !result.data?.access_token) return null;

        const { access_token, user } = result.data;
        return { id: user.id, email: user.email, name: user.name ?? null, accessToken: access_token };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = (user as BackendUser & { accessToken: string }).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};
