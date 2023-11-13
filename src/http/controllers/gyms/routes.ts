import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createGym } from "./create-gym";
import { fetchNearbyGyms } from "./fetch-nearby-gyms";
import { searchGyms } from "./search-gyms";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);

  app.post("/gyms", createGym);
  app.get("/gyms/search", searchGyms);
  app.get("/gyms/nearby", fetchNearbyGyms);
}
