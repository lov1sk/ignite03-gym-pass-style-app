import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements IUsersRepository {
  public users: User[] = [];
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      created_at: new Date(),
      password_hash: data.password_hash,
    };
    this.users.push(user);

    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }
}
