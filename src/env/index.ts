import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  PORT: z.coerce.number().default(3232),
});

const _parsedEnv = envSchema.safeParse(process.env);

if (!_parsedEnv.success) {
  throw new Error("Invalid declaration of environment variables ");
}

export const env = _parsedEnv.data;
