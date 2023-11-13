import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { undefined } from "zod";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileUseCase = makeGetUserProfileUseCase();
  const { sub } = request.user;

  const { user } = await getUserProfileUseCase.execute({ id: sub });
  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
