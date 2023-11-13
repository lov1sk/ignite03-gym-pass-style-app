import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { getValidCoordinates } from "@/utils/get-valid-coordinates";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create check-in e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to create a new check-in", async () => {
    const token = await createAndAuthenticateUser(app);
    const { coordinates } = getValidCoordinates();

    const gym = await prisma.gym.create({
      data: {
        title: "Gym 01",
        latitude: coordinates.notDistantGym.latitude,
        longitude: coordinates.notDistantGym.longitude,
      },
    });

    //app.post("/gyms/:gymId/check-ins", createCheckIn);
    const createCheckInResponse = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_latitude: coordinates.myDistance.latitude,
        user_longitude: coordinates.myDistance.longitude,
      });

    const { checkIn } = createCheckInResponse.body;

    expect(createCheckInResponse.statusCode).toEqual(201);
    expect(checkIn).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    );
  });
});
