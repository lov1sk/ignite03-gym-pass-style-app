import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;
const notDistantGym = {
  latitude: -23.6730573,
  longitude: -46.7992232,
};
const myLocation = {
  latitude: -23.6853768,
  longitude: -46.7906377,
};

describe("Fetch User CheckIns History Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Teste 1",
      latitude: notDistantGym.latitude,
      longitude: notDistantGym.longitude,
    });
    await gymsRepository.create({
      title: "Teste 1",
      latitude: notDistantGym.latitude,
      longitude: notDistantGym.longitude,
    });
    await gymsRepository.create({
      title: "Teste 1",
      latitude: 0,
      longitude: 0,
    });
    const { gyms } = await sut.execute({
      user_latitude: myLocation.latitude,
      user_longitude: myLocation.longitude,
    });
    expect(gyms).toHaveLength(2);
  });
});
