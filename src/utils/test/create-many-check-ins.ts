import { prisma } from "@/lib/prisma";
import { createGym } from "./create-gym";

export async function createManyCheckIns(quantity: number): Promise<void> {
  const gym = await createGym();
  const user = await prisma.user.findFirstOrThrow();

  for (let i = 0; i < quantity; i++) {
    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });
  }
}
