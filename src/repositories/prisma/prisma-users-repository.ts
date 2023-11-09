import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { IUsersRepository } from "../users-repository";

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data });
    return user;
  }
  async findByEmail(email: string) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (!userWithSameEmail) {
      return null;
    }
    return userWithSameEmail;
  }
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }
    return user;
  }
}
