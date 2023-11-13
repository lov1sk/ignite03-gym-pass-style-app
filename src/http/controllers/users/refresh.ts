import { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true });

  const { role } = request.user;

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    }
  );
  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
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
}
