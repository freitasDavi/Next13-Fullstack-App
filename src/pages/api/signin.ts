import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { comparePasswords, createJWT } from "@/lib/auth";
import { serialize } from "cookie";

export default async function signin(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    const user = await db.user.findUnique({
      where: {
        email: request.body.email,
      },
    });

    if (!user) {
      return response.status(401).json({ error: "Invalid Login" });
    }

    const isUser = await comparePasswords(request.body.password, user.password);

    if (isUser) {
      const jwt = await createJWT(user);

      response.setHeader(
        "Set-Cookie",
        serialize(process.env.COOKIE_NAME, jwt, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
      );

      return response.status(201).end();
    } else {
      return response.status(401).json({ error: "Invalid login" });
    }
  } else {
    response.status(402).end();
  }
}
