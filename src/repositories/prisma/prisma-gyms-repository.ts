import { Prisma } from "@prisma/client";
import { IGymsRepository } from "../gyms-repository";

export class PrismaGymsRepository implements IGymsRepository {
  async findById(id: string) {
    throw new Error("Method not implemented.");
  }
  async searchMany(query: string, page: number) {
    throw new Error("Method not implemented.");
  }
  async findManyNearby(user_latitude: number, user_longitude: number) {
    throw new Error("Method not implemented.");
  }
  async create(data: Prisma.GymCreateInput) {
    throw new Error("Method not implemented.");
  }
}
