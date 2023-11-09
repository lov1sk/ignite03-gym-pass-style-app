import { fastify } from "fastify";
import { appRoutes } from "./http/routes";
import { error } from "console";
import { request } from "http";
import { ZodError } from "zod";
import { env } from "./env";

export const app = fastify();
app.register(appRoutes);
app.setErrorHandler((error, request, reply) => {
  // se for um erro de validação,ele retorna o StatusCode 400 para o cliente
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.format() });
  }

  /**
   * Aqui diz respeito aos logs e a stack trace de erros que a aplicação gerou
   * se estivermos em desenvolvimento ele deve mostrar no console o que aconteceu
   * se estivermos em produção, deve armazenar o log
   */
  if (env.NODE_ENV !== "prod") {
    console.error(error);
  } else {
    // TODO: handle error on an external tool
  }

  return reply.status(500).send({ message: "Internal server error" });
});
