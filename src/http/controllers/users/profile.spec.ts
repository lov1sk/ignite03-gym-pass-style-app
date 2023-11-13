import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Profile e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to registrate", async () => {
    const token = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    const { user } = profileResponse.body;

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Lucas",
        email: "example@example.com",
        created_at: expect.any(String),
      })
    );
  });
});
