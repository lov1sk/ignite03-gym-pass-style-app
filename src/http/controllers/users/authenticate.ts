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

    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
        },
      }
    );
    const refreshToken = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d", // expira em 7 dias
        },
      }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/", //Todas as rotas do backend podem usar
        secure: true, //Implementa o padrão HTTPs e não deixa o front end usar essa informação
        sameSite: true, //Esse cookie só é valido no nosso dominio
        httpOnly: true, //Só o backend pode usar o cookie
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(400).send(error.message);
    }
    throw error;
  }
}
