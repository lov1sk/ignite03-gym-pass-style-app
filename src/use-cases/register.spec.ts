import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  it("should registrate", async () => {
    const { user } = await sut.execute({
      name: "Lucas Ribeiro",
      email: "test@example.com",
      password: "ndsaihdb",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "Lucas Ribeiro",
      email: "test@example.com",
      password: "ndsaihdb",
    });

    const isPasswordCorrectlyHashed = await compare(
      "ndsaihdb",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
  it("not should be able to register woth same email twice", async () => {
    sut;

    await sut.execute({
      name: "Lucas Ribeiro",
      email: "test@example.com",
      password: "ndsaihdb",
    });

    await expect(() =>
      sut.execute({
        name: "Lucas Ribeiro",
        email: "test@example.com",
        password: "ndsaihdb",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
