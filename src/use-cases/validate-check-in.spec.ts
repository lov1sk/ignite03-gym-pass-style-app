import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CreateGymUseCase } from "./create-gym";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check In Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to validate an existent check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.checkins[0].validated_at).toEqual(
      expect.any(Date)
    );
  });
  it("should not be able to validate an inexistent check-in", async () => {
    await expect(
      sut.execute({
        checkInId: "sjiabd",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
  it("should not be able to validate an check-in after 20 minutes of his creation", async () => {
    vi.setSystemTime(new Date(2023, 10, 10, 11, 5, 0));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const tweenyOneMinutesInMilliseconds = 1000 * 60 * 21;

    vi.advanceTimersByTime(tweenyOneMinutesInMilliseconds);

    await expect(
      sut.execute({ checkInId: createdCheckIn.id })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
