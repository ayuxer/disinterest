import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fastifyVue from "@fastify/vue/plugin";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const path = fileURLToPath(import.meta.url);
const root = resolve(dirname(path), "client");

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [vue(), fastifyVue()],
});
