import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch User CheckIns History Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
  });

  it("should be able to fetch user checkins history", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });
    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });
    const { checkins } = await sut.execute({ user_id: "user-01", page: 1 });
    expect(checkins).toHaveLength(2);
    expect(checkins).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });
  it("should be able to fetch paginated user checkins history", async () => {
    // Criação de 25 itens
    for (let i = 0; i < 25; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }
    const { checkins } = await sut.execute({ user_id: "user-01", page: 2 });

    expect(checkins).toHaveLength(5);
  });
});
