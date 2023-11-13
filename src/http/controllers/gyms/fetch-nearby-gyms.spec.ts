import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { getValidCoordinates } from "@/utils/get-valid-coordinates";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Fetch Nearby gyms e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to get nearby gyms by user location", async () => {
    const token = await createAndAuthenticateUser(app);

    const { coordinates } = getValidCoordinates();

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 01",
        description: "A new and modern gym",
        phone: "11 99999-9999",
        latitude: coordinates.notDistantGym.latitude,
        longitude: coordinates.notDistantGym.longitude,
      });
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 02",
        description: "A new and modern gym 2",
        phone: "11 99999-9999",
        latitude: coordinates.notDistantGym.latitude,
        longitude: coordinates.notDistantGym.longitude,
      });
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 02",
        description: "A new and modern gym 2",
        phone: "11 99999-9999",
        latitude: 1,
        longitude: 1,
      });

    const nearbyGyms = await request(app.server)
      .get("/gyms/nearby")
      .query({
        user_latitude: coordinates.myDistance.latitude,
        user_longitude: coordinates.myDistance.longitude,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();
    const { gyms } = nearbyGyms.body;

    expect(nearbyGyms.statusCode).toEqual(200);
    expect(gyms).toHaveLength(2);
  });
});
