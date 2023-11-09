import { beforeEach, expect, describe, it, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { randomUUID } from "crypto";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

/**
 * Repositories
 */
let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;
// Coordenadas do meu AP
const myCoordinates = {
  latitude: -23.6816899,
  longitude: -46.7920416,
};
// Coordenadas a 700m
const distantGym = {
  latitude: -23.678912,
  longitude: -46.793289,
};
// Coordenadas a 180m
const notDistantGym = {
  latitude: -23.6807728,
  longitude: -46.7938524,
};

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    // Usa datas do mock
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Volta a usar as datas do sistema
    vi.useRealTimers();
  });

  it("should be able to create an checkin", async () => {
    const gym = {
      id: "gym-01",
      title: "Test Gym",
      description: "",
      phone: "",
      latitude: new Decimal(notDistantGym.latitude),
      longitude: new Decimal(notDistantGym.longitude),
    };

    await gymsRepository.create(gym);
    // Setou a data do sistema para 20/01/2022 as 8h
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gym_id: "gym-01",
      user_id: "user-01",
      user_latitude: myCoordinates.latitude,
      user_longitude: myCoordinates.longitude,
    });

    expect(checkIn.gym_id).toEqual("gym-01");
  });

  it("not should be able to check in twice in the same day", async () => {
    // Setou a data do sistema para 20/01/2022 as 8h
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const gym = {
      id: "gym-01",
      title: "Test Gym",
      description: "",
      phone: "",
      latitude: new Decimal(notDistantGym.latitude),
      longitude: new Decimal(notDistantGym.longitude),
    };

    await gymsRepository.create(gym);

    await sut.execute({
      gym_id: "gym-01",
      user_id: "1",
      user_latitude: myCoordinates.latitude,
      user_longitude: myCoordinates.longitude,
    });

    await expect(
      sut.execute({
        gym_id: "gym-01",
        user_id: "1",
        user_latitude: myCoordinates.latitude,
        user_longitude: myCoordinates.longitude,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });
  it("should be able to check in twice but in different days", async () => {
    // Setou a data do sistema para 20/01/2022 as 8h
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    const gym = {
      id: "gym-01",
      title: "Test Gym",
      description: "",
      phone: "",
      latitude: new Decimal(notDistantGym.latitude),
      longitude: new Decimal(notDistantGym.longitude),
    };

    await gymsRepository.create(gym);

    await sut.execute({
      gym_id: "gym-01",
      user_id: "1",
      user_latitude: myCoordinates.latitude,
      user_longitude: myCoordinates.longitude,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gym_id: "gym-01",
      user_id: "1",
      user_latitude: myCoordinates.latitude,
      user_longitude: myCoordinates.longitude,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
  it("not should be able to check in on a distant gym", async () => {
    // Setou a data do sistema para 22/01/2022 as 8h
    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));
    const gym = {
      id: "gym-01",
      title: "Test Gym",
      description: "",
      phone: "",
      latitude: new Decimal(distantGym.latitude),
      longitude: new Decimal(distantGym.longitude),
    };

    await gymsRepository.create(gym);

    await expect(
      sut.execute({
        gym_id: "gym-01",
        user_id: "1",
        user_latitude: myCoordinates.latitude,
        user_longitude: myCoordinates.longitude,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
  it("should be able to check in on a nearby gym", async () => {
    // Setou a data do sistema para 22/01/2022 as 8h
    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));
    const gym = {
      id: "gym-01",
      title: "Test Gym",
      description: "",
      phone: "",
      latitude: new Decimal(notDistantGym.latitude),
      longitude: new Decimal(notDistantGym.longitude),
    };

    await gymsRepository.create(gym);

    const { checkIn } = await sut.execute({
      gym_id: "gym-01",
      user_id: "1",
      user_latitude: myCoordinates.latitude,
      user_longitude: myCoordinates.longitude,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
});
