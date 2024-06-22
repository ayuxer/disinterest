import { load } from "cheerio";
import { type FastifyInstance } from "fastify";
import { getProxiedUrl } from "./proxy";

function isObject(item: unknown) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function mergeDeep(target: object, ...sources: object[]) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

async function scrape(
  server: FastifyInstance,
  baseUrl: string,
  id: string | number
) {
  const scraped = await fetch("https://www.pinterest.com/pin/" + id, {
    headers: {
      _auth: "0",
      _pinterest_sess:
        "TWc9PSZWdTN5b1FQZXdjYmU2eWVYTDhOY3RJZE92TEdLbUl4bTN0aWJmTUNnYkxHWjc5Sk4wKzM1SWdZOXJoV2hDUmRSTnJTenFyRDg1cFhCUlBYRmxaMWdBTGdwV08wM2toMHZmc0trYkxMcExUST0mQjV5VXhmZCtFZWJGZmV3RENhZ1pqWGs3aStrPQ==",
      _routing_id: '"e9312c61-eb02-4261-983a-2e00fbb9c225"',
      csrftoken: "2ad2559667502ad314ab7be233618b94",
      sessionFunnelEventLogged: "1",
    },
  }).then((f) => f.text());
  const $ = load(scraped);
  const out: any = {};
  const text = $('script[type="application/json"]')
    .contents()
    .map(function () {
      return this.type === "text" ? $(this).text() : "";
    })
    .get();
  text.forEach((input) => {
    try {
      const json = JSON.parse(input)?.response?.data;
      json && mergeDeep(out, json);
    } catch (_) {}
  });
  if (!out.v3GetPinQuery?.data) return server.httpErrors.notFound();
  const { data } = out.v3GetPinQuery;
  let image = data.images?.url;
  if (!image) {
    const specs = ["orig", "736x", "564x", "474x", "236x", "170x", "136x136"];
    for (const spec of specs) {
      const value = data["imageSpec_" + spec];
      if (value) {
        image = value;
        break;
      }
    }
  }
  if (!image) return {};
  return {
    tags: data.pinJoin.visualAnnotation,
    title: data.gridTitle || null,
    description: data.richSummary ?? (data.gridDescription.trim() || null),
    pinUrl: baseUrl + "/pin/" + id,
    url: baseUrl + "/pin/" + id,
    image: getProxiedUrl(baseUrl, image),
    thumbnail: getProxiedUrl(baseUrl, image),
    source: data.richSummary ?? "Pinterest",
    pinner: {
      name: data.pinner.full_name || null,
      username: data.pinner.username || null,
      image: getProxiedUrl(
        baseUrl,
        data.pinner.image_large_url ||
          data.pinner.image_medium_url ||
          data.pinner.image_small_url
      ),
    },
  };
}

export default (baseUrl: string, server: FastifyInstance) =>
  server.get("/pin.json/:id", async (req, reply) => {
    let { id = "" } = req.params as any;
    if (!id) return;
    id = Number.parseInt(id);
    if (!id)
      return server.httpErrors.badRequest(
        "id: given value is empty or not a number."
      );
    const data = await scrape(server, baseUrl, id);
    return reply.send(data);
  });
