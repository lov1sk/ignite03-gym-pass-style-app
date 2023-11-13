import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { createManyCheckIns } from "@/utils/test/create-many-check-ins";

describe("Get check-ins history e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to list check-ins history", async () => {
    const token = await createAndAuthenticateUser(app);
    await createManyCheckIns(3);

    //app.post("/gyms/:gymId/check-ins", createCheckIn);
    const checkInsHistory = await request(app.server)
      .get("/check-ins/history")
      .set("Authorization", `Bearer ${token}`)
      .send();

    const { checkins } = checkInsHistory.body;

    expect(checkInsHistory.statusCode).toEqual(200);
    expect(checkins).toHaveLength(3);
  });
});
