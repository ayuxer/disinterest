import fastifySensible from "@fastify/sensible";
import fastify from "fastify";
import proxy from "./proxy";
import search from "./search";
import scrape from "./scrape";
import { fileURLToPath } from "url";
import fastifyVite from "@fastify/vite";

let port = Number(process.env.PORT);
if (isNaN(port) || port < 0 || port > 65535) {
  console.log(
    `port: Argument '${port}' is NaN, lower than zero, or bigger than 65535. Using default value instead...`
  );
  port = 8888;
}

let baseUrl = process.env.BASE_URL?.trim() || "<not provided>";
try {
  new URL(baseUrl);
} catch (_) {
  console.log(
    `baseUrl: Argument '${baseUrl}' doesn't follow URL pattern. Using default value instead...`
  );
  baseUrl = "https://localhost:" + port;
}

const logger =
  process.env.LOG !== "false" && process.env.LOG !== "no"
    ? { transport: { target: "@fastify/one-line-logger", colorize: true } }
    : false;

const server = fastify({ logger });

await server
  .register(fastifySensible)
  .register(fastifyVite, {
    root: fileURLToPath(new URL("..", import.meta.url)),
    dev: process.argv.includes('--dev'),
    renderer: "@fastify/vue"
  });
await server.vite.ready();

proxy(server);
search(baseUrl, server);
scrape(baseUrl, server);

server
  .ready()
  .then(() =>
    server.listen({ port }, async (err, addr) =>
      err
        ? console.error(err)
        : console.log("disinterest listening to requests on", addr, baseUrl)
    )
  );
