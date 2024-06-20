import { type HttpError } from "@fastify/sensible";
import { type FastifyInstance } from "fastify";
import type { ReadableStream } from "stream/web";

const hosts = ["pinimg.com", "i.pinimg.com", "pinterest.com"];

interface ProxiedImage {
  contentType: string;
  data: ReadableStream<Uint8Array>;
}

async function proxy(
  server: FastifyInstance,
  url: URL,
): Promise<HttpError | ProxiedImage> {
  if (!hosts.includes(url.hostname))
    return server.httpErrors.createError(
      400,
      "Unsupported host; only Pinterest media can be proxied.",
    );
  const res = await fetch(url);
  if (!res.ok) {
    server.log.error(`Failed to fetch ${url}: ${await res.text()}`);
    return server.httpErrors.notFound();
  }
  const ext = url.pathname.substring(1 + url.pathname.lastIndexOf("."));
  return {
    contentType: "image/" + (ext === "png" ? "png" : "jpg"),
    data: await res.blob().then((b) => b.stream()),
  };
}

export default (server: FastifyInstance) =>
  server.route({
    method: "GET",
    url: "/img/proxied",
    schema: {
      querystring: {
        type: "object",
        required: ["url"],
        properties: {
          url: { type: "string" },
        },
      },
    },
    handler: async (req, reply) => {
      let { url = null } = req.query as any;
      try {
        url = new URL(url);
      } catch (err) {
        return reply.send(server.httpErrors.badRequest());
      }
      const data = await proxy(server, url);
      if (!data.contentType) return reply.send(data);
      return reply.header("Content-Type", data.contentType).send(data.data);
    },
  });
