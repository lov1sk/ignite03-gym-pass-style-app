import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;
const notDistantGym = {
  latitude: -23.6807728,
  longitude: -46.7938524,
};

describe("Create Gym use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it("should be able to create a new gym", async () => {
    const { gym } = await sut.execute({
      title: "Test gym 01",
      latitude: notDistantGym.latitude,
      longitude: notDistantGym.longitude,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
