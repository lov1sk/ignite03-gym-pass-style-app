import { CheckIn, Prisma } from "@prisma/client";

export interface ICheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  countByUserId(user_id: string): Promise<number>;
  findById(id: string): Promise<CheckIn | null>;
  findManyByUserId(user_id: string, page: number): Promise<CheckIn[]>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  save(data: CheckIn): Promise<CheckIn>;
}
