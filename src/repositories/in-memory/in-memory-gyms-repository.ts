import { Gym, Prisma } from "@prisma/client";
import { IGymsRepository } from "../gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id);
    if (!gym) {
      return null;
    }
    return gym;
  }
  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
    return gyms;
  }
  async findManyNearby(latitude: number, longitude: number): Promise<Gym[]> {
    const nearbyGyms = this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        }
      );

      return distance < 10;
    });

    return nearbyGyms;
  }
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      phone: data.phone ?? null,
      description: data.description ?? null,
      latitude: new Decimal(Number(data.latitude)),
      longitude: new Decimal(Number(data.longitude)),
    };

    await this.gyms.push(gym);

    return gym;
  }
}
