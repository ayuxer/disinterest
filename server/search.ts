import { type FastifyInstance } from "fastify";
import type Pin from "./types";
import { getProxiedUrl } from "./proxy";

interface Search {
  results: Pin[];
  bookmark: string | null;
}

async function search(
  baseUrl: string,
  query: string,
  bookmarks: string,
  token: string
): Promise<Search> {
  const queryData: any = {
    options: { query },
  };
  if (bookmarks && bookmarks !== "null")
    queryData.options.bookmarks = [bookmarks];
  const headers: Record<string, string> =
    token && token !== "null"
      ? { csrftoken: token, cookie: "cookie:csrftoken=" + token }
      : {};
  const url =
    "https://www.pinterest.com/resource/BaseSearchResource/get?data=" +
    encodeURIComponent(JSON.stringify(queryData));
  const data = await fetch(url, { headers });
  const json: any = await data.json();
  const out = {
    results: await Promise.all(
      json.resource_response?.data?.results?.map(async (v: any) => {
        return v.type === "story"
          ? []
          : [
              {
                pinUrl: baseUrl + "/pin/" + v.id,
                url: v.link || baseUrl + "/pin/" + v.id,
                title: v.title || v.grid_title || null,
                content: v.rich_summary || v.display_description || null,
                image: getProxiedUrl(baseUrl, v.images.orig.url),
                thumbnail: getProxiedUrl(baseUrl, v.images["236x"].url),
                source: v.rich_summary || v.site_name,
                pinner: {
                  name: v.pinner.full_name || null,
                  username: v.pinner.username || null,
                  image: getProxiedUrl(
                    baseUrl,
                    v.pinner.image_large_url ||
                      v.pinner.image_medium_url ||
                      v.pinner.image_small_url
                  ),
                },
              },
            ];
      })
    ).then((arr) => arr.flat()),
    bookmark: json.resource_response?.bookmark,
  };
  return out;
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
      if (!q)
        return server.httpErrors.badRequest("q: given parameter is empty.");
      return reply.send(await search(baseUrl, q, bookmarks, csrftoken));
    },
  });
