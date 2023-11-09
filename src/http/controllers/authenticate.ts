import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = registerBodySchema.parse(request.body);
  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    await authenticateUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(400).send(error.message);
    }
    throw error;
  }
  return reply.status(200).send();
}
