import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Authenticate e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to registrate", async () => {
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

    expect(authenticateResponse.statusCode).toEqual(200);
    expect(authenticateResponse.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });
});
