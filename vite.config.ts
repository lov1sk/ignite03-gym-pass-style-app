import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    /**
     * Aqui que definimos que queremos executar os testes de outro ambiente tbm
     */
    environmentMatchGlobs: [["src/http/controllers/**", "prisma"]],
    dir: "src", // Incluir essa linha
  },
});
