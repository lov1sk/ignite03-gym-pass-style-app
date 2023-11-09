import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;
const notDistantGym = {
  latitude: -23.6807728,
  longitude: -46.7938524,
};

describe("Search Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to fetch gyms", async () => {
    await gymsRepository.create({
      title: "Test gym 01",
      latitude: notDistantGym.latitude,
      longitude: notDistantGym.longitude,
    });
    await gymsRepository.create({
      title: "Test gym 02",
      latitude: notDistantGym.latitude,
      longitude: notDistantGym.longitude,
    });
    const { gyms } = await sut.execute({ query: "Test", page: 1 });
    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Test gym 01" }),
      expect.objectContaining({ title: "Test gym 02" }),
    ]);
  });
  it("should be able to fetch paginated gyms", async () => {
    for (let i = 0; i < 25; i++) {
      await gymsRepository.create({
        title: `Test gym ${i}`,
        latitude: notDistantGym.latitude,
        longitude: notDistantGym.longitude,
      });
    }
    const { gyms } = await sut.execute({ query: "Test", page: 2 });
    expect(gyms).toHaveLength(5);
  });
});
