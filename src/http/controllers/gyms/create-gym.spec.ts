import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { getValidCoordinates } from "@/utils/get-valid-coordinates";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create gym e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to create a new gym", async () => {
    const token = await createAndAuthenticateUser(app);

    const { coordinates } = getValidCoordinates();
    const createGymResponse = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 01",
        description: "A new and modern gym",
        phone: "11 99999-9999",
        latitude: coordinates.notDistantGym.latitude,
        longitude: coordinates.notDistantGym.longitude,
      });

    expect(createGymResponse.statusCode).toEqual(201);
  });
});
