import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createCheckIn } from "./create";
import { getCheckInsHistory } from "./history";
import { getCheckInsMetrics } from "./metrics";
import { validateCheckIn } from "./validate";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);

  app.post("/gyms/:gymId/check-ins", createCheckIn);
  app.get("/check-ins/history", getCheckInsHistory);
  app.get("/check-ins/metrics", getCheckInsMetrics);
  app.patch("/check-ins/:checkInId/validate", validateCheckIn);
}
