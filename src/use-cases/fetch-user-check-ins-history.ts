import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn, Gym } from "@prisma/client";

interface FetchUserCheckInsHistoryUseCaseRequest {
  user_id: string;
  page: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkins: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}
  async execute({
    user_id,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkInsHistory = await this.checkInsRepository.findManyByUserId(
      user_id,
      page
    );

    return {
      checkins: checkInsHistory,
    };
  }
}
