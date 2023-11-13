import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { createManyCheckIns } from "@/utils/test/create-many-check-ins";

describe("Get check-ins metrics e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to get the check-ins count", async () => {
    const token = await createAndAuthenticateUser(app);
    await createManyCheckIns(3);

    const checkInsMetrics = await request(app.server)
      .get("/check-ins/metrics")
      .set("Authorization", `Bearer ${token}`)
      .send();

    const { checkinsCount } = checkInsMetrics.body;

    expect(checkInsMetrics.statusCode).toEqual(200);
    expect(checkinsCount).toEqual(3);
  });
});
