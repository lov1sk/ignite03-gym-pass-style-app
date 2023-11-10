import { CheckIn, Prisma } from "@prisma/client";
import { IGymsRepository } from "../gyms-repository";
import { ICheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({ data });
    return checkIn;
  }
  async countByUserId(user_id: string) {
    const checkInCount = await prisma.checkIn.count({
      where: {
        user_id,
      },
    });

    return checkInCount;
  }
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });
    return checkIn;
  }
  async findManyByUserId(user_id: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIns;
  }
  async findByUserIdOnDate(userId: string, date: Date) {
    /**
     * Pega o inicio e o fim do dia passado
     */
    const startOfDay = dayjs(date).startOf("date");
    const endOfDay = dayjs(date).endOf("date");

    // Filtra o recurso dentro do banco de dados
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          // Greater than
          gte: startOfDay.toDate(),
          // Lower than
          lte: endOfDay.toDate(),
        },
      },
    });

    return checkIn;
  }
  async save(data: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    });

    return updatedCheckIn;
  }
}
