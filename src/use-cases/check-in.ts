import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { IGymsRepository } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

interface CheckInUseCaseRequest {
  gym_id: string;
  user_id: string;
  user_latitude: number;
  user_longitude: number;
}
interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository
  ) {}
  async execute({
    gym_id,
    user_id,
    user_latitude,
    user_longitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    /**
     * Acha uma academia salva na base de dados
     */
    const gym = await this.gymsRepository.findById(gym_id);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    /**
     * Ve se existe outro checkin do usuario no mesmo dia
     */
    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      user_id,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    /**
     * Ve se a distancia esta valida, dentro dos 200m
     */
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: user_latitude,
        longitude: user_longitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.3;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id,
      user_id,
    });
    return { checkIn };
  }
}
