import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, {
    providers: [
      // Using magic link for now, but we can add other providers later.
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
      }),
    ],
  });
}
