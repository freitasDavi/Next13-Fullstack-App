import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { createJWT, hashPassword } from "@/lib/auth";
import { serialize } from "cookie";

export default async function register(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    const user = await db.user.create({
      data: {
        email: request.body.email,
        password: await hashPassword(request.body.password),
        firstName: request.body.firstName,
        lastName: request.body.lastName,
      },
    });

    const jwt = await createJWT({
      email: user.email,
      id: user.id,
    });

    response.setHeader(
      "Set-Cookie",
      serialize(process.env.COOKIE_NAME!, jwt, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    response.status(201).end();
  } else {
    response.status(402).end();
  }
}
