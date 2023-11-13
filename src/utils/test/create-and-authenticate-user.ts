import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
  app: FastifyInstance
): Promise<string> {
  await request(app.server).post("/users").send({
    name: "Lucas",
    email: "example@example.com",
    password: "34791034",
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
