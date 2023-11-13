import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getCheckInsMetrics(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();
  const { checkinsCount } = await getUserMetricsUseCase.execute({
    user_id: request.user.sub,
  });

  return reply.status(200).send({ checkinsCount });
}
