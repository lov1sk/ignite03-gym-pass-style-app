import "dotenv/config";
import { randomUUID } from "crypto";
import type { Environment } from "vitest";
import { execSync } from "child_process";
import { prisma } from "@/lib/prisma";

/**
 * Exportamos um objeto global para dizer ao vitest que vamos
 * configurar um novo ambiente, por isso passamos o nome do ambiente
 * => NESTE CASO É IMPORTANTE QUE O NOME SEJA IGUAL A ULTIMA PALAVRA DA
 * PASTA 'vitest-environment-<esse nome aqui>'
 *
 * Temos obrigatoriamente trabalhar com os metodos setup (executa antes de cada teste)
 * e teardown (executa depois de cada teste)
 *
 * O transform mode é obrigatorio e passar web
 */

function generateDatabaseSchemaUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Please provide a valid environment variable to connect to the database"
    );
  }
  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  transformMode: "web",
  //qual codigo queremos executar antes de cada teste
  async setup() {
    const schema = randomUUID();

    /**
     * Sobreescrita da variavel de ambiente para mudar o schema do banco de dados
     */
    process.env.DATABASE_URL = generateDatabaseSchemaUrl(schema);
    execSync("npx prisma migrate deploy");

    //qual codigo queremos executar depois de cada teste
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema} CASCADE"`
        );

        await prisma.$disconnect();
      },
    };
  },
};
