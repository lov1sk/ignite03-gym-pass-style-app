import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { IGymsRepository } from "@/repositories/gyms-repository";
import { CheckIn, Gym } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}
  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkin = await this.checkInsRepository.findById(checkInId);

    if (!checkin) {
      throw new ResourceNotFoundError();
    }

    // validar se a data atual é 20 após a criação do checkin
    const distanceInMinutesUntilCheckInCreationToNow = dayjs(new Date()).diff(
      checkin.created_at,
      "minutes"
    );

    if (distanceInMinutesUntilCheckInCreationToNow > 20) {
      throw new LateCheckInValidationError();
    }

    checkin.validated_at = new Date();

    const savedCheckIn = await this.checkInsRepository.save(checkin);
    return {
      checkIn: savedCheckIn,
    };
  }
}
