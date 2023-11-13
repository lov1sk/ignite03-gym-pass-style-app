import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createCheckIn(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createCheckInUseCase = makeCheckInUseCase();
  const requestParamsSchema = z.object({
    gymId: z.string(),
  });
  const requestBodySchema = z.object({
    user_latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    user_longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { user_latitude, user_longitude } = requestBodySchema.parse(
    request.body
  );
  const { gymId } = requestParamsSchema.parse(request.params);
  const { checkIn } = await createCheckInUseCase.execute({
    gym_id: gymId,
    user_id: request.user.sub,
    user_latitude,
    user_longitude,
  });

  return reply.status(201).send({ checkIn });
}
