import { IGymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymsUseCaseRequest {
  user_latitude: number;
  user_longitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}
  async execute({
    user_latitude,
    user_longitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby(
      user_latitude,
      user_longitude
    );

    return {
      gyms,
    };
  }
}
