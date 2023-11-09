import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

/**
 * Repositories
 */
let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("GetUserProfile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get the user profile", async () => {
    const userCreated = await usersRepository.create({
      name: "Lucas",
      email: "lucas@gmail.com.br",
      password_hash: await hash("34791034", 6),
    });

    const { user } = await sut.execute({ id: userCreated.id });
    expect(user).toEqual(
      expect.objectContaining({
        name: "Lucas",
        email: "lucas@gmail.com.br",
      })
    );
  });
  it("should not be able to get the user profile with wrong id", async () => {
    await usersRepository.create({
      name: "Lucas",
      email: "lucas@gmail.com.br",
      password_hash: await hash("34791034", 6),
    });

    await expect(sut.execute({ id: "11111" })).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
  });
});
