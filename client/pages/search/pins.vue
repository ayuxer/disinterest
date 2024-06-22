<template>
  <Layout :query="query" :bookmark="bookmark" :csrftoken="csrftoken">
    <ol
      id="pin-list"
      class="list-none columns-1 md:columns-4 lg:columns-6 gap-6"
    >
      <li
        v-for="item in results"
        :key="item.pinUrl"
        class="break-inside-avoid mb-6 flex flex-col items-center justify-center gap-2"
      >
        <a :href="item.pinUrl">
          <img
            :src="item.thumbnail || item.image"
            class="rounded-xl w-64"
            alt=""
          />
        </a>
        <div class="w-0 min-w-full text-left text-sm">
          <a :href="item.pinUrl" v-if="item.title">
            <strong class="line-clamp-2 my-1">{{ item.title }}</strong>
          </a>
          <div
            class="flex flex-row items-center gap-2"
            v-if="item.pinner.name || item.pinner.username"
          >
            <img :src="item.pinner.image" class="w-8 rounded-full" alt="" />
            <span class="line-clamp-1">{{
              item.pinner.name ? item.pinner.name : "@" + item.pinner.username
            }}</span>
          </div>
        </div>
      </li>
    </ol>
  </Layout>
</template>

<script>
import Layout from "../../components/Layout.vue";
import { useRouter } from "vue-router";
import { isServer, useRouteContext } from "/:core.js";

async function get(ctx) {
  if (!ctx?.req) return {};
  const {
    q: query = "",
    bookmarks = "null",
    csrftoken = "null",
  } = useRouter()?.currentRoute?.value?.query ?? {};
  if (!query) return {};
  const url =
    ctx.req.protocol +
    "://" +
    ctx.req.hostname +
    "/search/pins.json?q=" +
    encodeURIComponent(query) +
    "&bookmarks=" +
    encodeURIComponent(bookmarks) +
    "&csrftoken=" +
    encodeURI(csrftoken);
  const data = await fetch(url);
  const json = await data.json();
  return { ...json, query, csrftoken };
}

export default {
  async setup() {
    const ctx = useRouteContext();
    if (isServer) {
      ctx.state.data = await get(ctx);
    }
    return ctx.state.data;
  },
  data: () => ({
    results: [],
    query: "",
    bookmark: "null",
    csrftoken: "null",
    reqs: [],
  }),
  components: {
    Layout,
  },
  methods: {
    handleScroll: function (ev) {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight &&
        this &&
        this.bookmark &&
        this.bookmark !== "null"
      ) {
        const baseUrl =
          window.location.protocol +
          "//" +
          window.location.hostname +
          ":" +
          window.location.port;
        const bookmarkedUrl = new URL(
          baseUrl +
            document.querySelector("#search-next-page").getAttribute("href")
        );
        bookmarkedUrl.pathname += ".json";
        if (this.reqs.includes(bookmarkedUrl.toString())) return;
        (async () => {
          const res = await fetch(bookmarkedUrl);
          const json = await res.json();
          this.bookmark = json.bookmark;
          this.results.push(...json.results);
          this.reqs.push(bookmarkedUrl.toString());
        })();
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
