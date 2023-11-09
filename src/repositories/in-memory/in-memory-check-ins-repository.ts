import { CheckIn, Prisma } from "@prisma/client";
import { ICheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { CheckIfTwoDatesIsOnSameDay } from "@/utils/check-if-two-dates-is-on-same-date";

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public checkins: CheckIn[] = [];
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkin = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    };

    this.checkins.push(checkin);

    return checkin;
  }
  async countByUserId(user_id: string): Promise<number> {
    return this.checkins.filter((checkin) => checkin.user_id === user_id)
      .length;
  }
  async findManyByUserId(user_id: string, page: number): Promise<CheckIn[]> {
    const userCheckIns = this.checkins
      .filter((checkin) => checkin.user_id === user_id)
      .slice((page - 1) * 20, page * 20);
    return userCheckIns;
  }
  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    // Se nao retornar nada, são em dias diferentes

    const checkInOnSameDay = this.checkins.find((checkin) => {
      const isOnSameDate = CheckIfTwoDatesIsOnSameDay(date, checkin.created_at);

      return checkin.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDay) {
      return null;
    }
    return checkInOnSameDay;
  }
}
