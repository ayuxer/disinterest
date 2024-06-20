import { type FastifyInstance } from "fastify";
import type Pin from "./types";

interface Search {
  results: Pin[];
  bookmark: string | null;
}

async function search(
  baseUrl: string,
  query: string,
  bookmarks: string,
  token: string,
): Promise<Search> {
  const queryData: any = {
    options: { query },
  };
  if (bookmarks) queryData.options.bookmarks = bookmarks;
  const headers: Record<string, string> = token
    ? { csrftoken: token, cookie: "cookie:csrftoken=" + token }
    : {};
  const data = await fetch(
    "https://www.pinterest.com/resource/BaseSearchResource/get?data=" +
      encodeURIComponent(JSON.stringify(query)),
    {
      headers,
    },
  );
  const json: any = await data.json();
  return {
    results: await Promise.all(
      json.resource_response?.data?.results?.map(async (v: any) =>
        v.type === "story"
          ? []
          : [
              {
                pinUrl: baseUrl + "/pin/" + v.id,
                url: v.link || baseUrl + "/pin/" + v.id,
                title: v.title || v.grid_title,
                content:
                  v.rich_summary || v.display_description || "No description.",
                image: baseUrl + "/img/proxied?url=" + v.images.orig.url,
                thumbnail: baseUrl + "/img/proxied?url=" + v.images["236x"].url,
                source: v.rich_summary || v.site_name,
              },
            ],
      ),
    ).then((arr) => arr.flat()),
    bookmark: json.resource_response?.bookmark,
  };
}

export default (baseUrl: string, server: FastifyInstance) =>
  server.route({
    method: "GET",
    url: "/search/pins.json",
    schema: {
      querystring: {
        type: "object",
        required: ["q"],
        properties: {
          q: { type: "string" },
          csrftoken: { type: "string" },
          bookmarks: { type: "string" },
        },
      },
    },
    handler: async (req, reply) => {
      const { q = "", csrftoken = "", bookmarks = "" } = req.query as any;
      if (!q) return server.httpErrors.badRequest();
      return reply.send(await search(baseUrl, q, bookmarks, csrftoken));
    },
  });
