import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";
import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function validateCheckIn(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validateCheckInUseCase = makeValidateCheckInUseCase();
  const requestParamsSchema = z.object({
    checkInId: z.string(),
  });

  const { checkInId } = requestParamsSchema.parse(request.params);
  await validateCheckInUseCase.execute({ checkInId });

  return reply.status(204).send();
}
