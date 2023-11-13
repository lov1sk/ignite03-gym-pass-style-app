import { prisma } from "@/lib/prisma";
import { Gym } from "@prisma/client";
import { getValidCoordinates } from "../get-valid-coordinates";

export async function createGym(): Promise<Gym> {
  const { coordinates } = getValidCoordinates();
  const gym = await prisma.gym.create({
    data: {
      title: "Gym 01",
      latitude: coordinates.notDistantGym.latitude,
      longitude: coordinates.notDistantGym.longitude,
    },
  });
  return gym;
}
