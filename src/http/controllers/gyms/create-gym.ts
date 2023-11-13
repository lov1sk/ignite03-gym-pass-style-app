import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createGym(request: FastifyRequest, reply: FastifyReply) {
  const createGymUseCase = makeCreateGymUseCase();

  const requestBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    phone: z.string().optional(),
    latitude: z.number().refine((value) => value <= 90),
    longitude: z.number().refine((value) => value <= 180),
  });

  const requestBody = requestBodySchema.parse(request.body);
  const { gym } = await createGymUseCase.execute(requestBody);
  return reply.status(201).send({ gym });
}
