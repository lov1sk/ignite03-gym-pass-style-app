import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function fetchNearbyGyms(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const fetchNearbyGyms = makeFetchNearbyGymsUseCase();
  const requestQuerySchema = z.object({
    user_latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    user_longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { user_latitude, user_longitude } = requestQuerySchema.parse(
    request.query
  );
  const { gyms } = await fetchNearbyGyms.execute({
    user_latitude,
    user_longitude,
  });
  return reply.status(200).send({ gyms });
}
