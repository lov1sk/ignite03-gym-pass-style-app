import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("Refresh e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to get a new token and a refresh token", async () => {
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

    const cookies = authenticateResponse.get("Set-Cookie");

    const refreshResponse = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(refreshResponse.statusCode).toEqual(200);
    expect(refreshResponse.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
