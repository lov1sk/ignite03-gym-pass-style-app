import { ICheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
  user_id: string;
}
interface GetUserMetricsUseCaseResponse {
  checkinsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    user_id,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkinsCount = await this.checkInsRepository.countByUserId(user_id);

    return {
      checkinsCount,
    };
  }
}
