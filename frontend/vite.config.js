import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url)),
);

export default defineConfig({
  plugins: [react()],
  base: "./",
  define: {
    __API_BASE_URL__: JSON.stringify(
      process.env.VITE_API_BASE_URL ??
        "https://one-bank-to-rule-them-all-api-502428345364.europe-west1.run.app/",
    ),
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_TAG__: JSON.stringify(process.env.VITE_BUILD_TAG ?? "local"),
  },
});
