import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin: boolean = false
): Promise<string> {
  await prisma.user.create({
    data: {
      name: "Lucas",
      email: "example@example.com",
      password_hash: await hash("34791034", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  const authenticateResponse = await request(app.server)
    .post("/sessions")
    .send({
      email: "example@example.com",
      password: "34791034",
    });

  const { token } = authenticateResponse.body;
  return token;
}
