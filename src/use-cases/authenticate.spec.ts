import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

/**
 * Repositories
 */
let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });
  it("should authenticate", async () => {
    await usersRepository.create({
      name: "Lucas",
      email: "lucas@gmail.com.br",
      password_hash: await hash("34791034", 6),
    });

    const { user } = await sut.execute({
      email: "lucas@gmail.com.br",
      password: "34791034",
    });
    expect(user).toEqual(
      expect.objectContaining({
        name: "Lucas",
        email: "lucas@gmail.com.br",
      })
    );
  });
  it("not should be able to authenticate with wrong email", async () => {
    await usersRepository.create({
      name: "Lucas",
      email: "lucas@gmail.com.br",
      password_hash: await hash("34791034", 6),
    });

    await expect(
      sut.execute({
        email: "lucas@gmai.com.br",
        password: "34791034",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
  it("not should be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "Lucas",
      email: "lucas@gmail.com.br",
      password_hash: await hash("34791034", 6),
    });

    await expect(
      sut.execute({
        email: "lucas@gmail.com.br",
        password: "3479103",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
