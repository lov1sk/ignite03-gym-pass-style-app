import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { createManyCheckIns } from "@/utils/test/create-many-check-ins";
import { prisma } from "@/lib/prisma";

describe("Validate a check-in e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to validate a existent check-in", async () => {
    const token = await createAndAuthenticateUser(app);

    await createManyCheckIns(1);
    let checkIn = await prisma.checkIn.findFirstOrThrow();

    const validatedCheckIn = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(validatedCheckIn.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });
    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
