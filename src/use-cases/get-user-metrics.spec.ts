import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Fetch User CheckIns History Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to get the metrics of the user", async () => {
    for (let i = 0; i < 20; i++) {
      await checkInsRepository.create({
        user_id: "user-01",
        gym_id: `gym-${i}`,
      });
    }

    const { checkinsCount } = await sut.execute({ user_id: "user-01" });

    expect(checkinsCount).toEqual(20);
  });
});
