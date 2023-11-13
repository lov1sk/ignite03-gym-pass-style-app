import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getCheckInsHistory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();
  const requestQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = requestQuerySchema.parse(request.query);
  const { checkins } = await fetchUserCheckInsHistoryUseCase.execute({
    page,
    user_id: request.user.sub,
  });

  return reply.status(200).send({ checkins });
}
