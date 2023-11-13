import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Register e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to registrate", async () => {
    const registerResponse = await request(app.server).post("/users").send({
      name: "Lucas",
      email: "example@example.com",
      password: "34791034",
    });

    expect(registerResponse.statusCode).toEqual(201);
  });
});
