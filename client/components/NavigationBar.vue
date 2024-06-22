<script setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { ArrowRightIcon } from "@heroicons/vue/24/solid";
import { XCircleIcon } from "@heroicons/vue/24/solid";

const {
  query = null,
  bookmark = null,
  csrftoken = null,
} = defineProps(["query", "bookmark", "csrftoken"]);
</script>

<template>
  <nav
    class="flex flex-row flex-wrap gap-2 text-center justify-center items-center pb-3"
  >
    <a
      href="/"
      class="text-main-background text-3xl font-playful font-extrabold pointer-events-auto bg-accent pl-4 pr-5 py-1 rounded-full"
    >
      d
    </a>
    <form action="/search/pins" method="GET">
      <fieldset
        class="flex flex-row gap-3 group items-center justify-center max-w-5 w-fit"
      >
        <label
          class="flex flex-row items-center justify-between bg-[var(--colors-navbar-bg-alt)] shadow-md px-4 py-3 rounded-full"
        >
          <button type="submit">
            <MagnifyingGlassIcon
              class="size-5 [&>path]:stroke-[4] text-foreground-alt mr-2"
            />
          </button>
          <input
            autocomplete="off"
            class="peer inline-block bg-transparent text-main-foreground placeholder:text-foreground-alt focus:outline-none text-sm placeholder:text-sm"
            type="search"
            name="q"
            placeholder="Search for pins"
            tabindex="0"
            required
            :value="query"
            id="search-bar"
          />
          <button
            class="peer-invalid:hidden"
            type="reset"
            tabindex="0"
            value=""
          >
            <XCircleIcon class="size-5 text-foreground-alt" />
          </button>
        </label>
      </fieldset>
    </form>
    <div>
      <noscript>
        <a
          id="search-next-page"
          v-if="bookmark && bookmark !== 'null'"
          :href="
            '/search/pins?q=' +
            encodeURIComponent(query) +
            '&bookmarks=' +
            encodeURIComponent(bookmark) +
            '&csrftoken=' +
            encodeURIComponent(csrftoken)
          "
          class="bg-accent px-4 py-3 rounded-full text-[var(--colors-black)] flex flex-row gap-2 items-center justify-center"
        >
          <ArrowRightIcon class="size-5" />
          Next page
        </a>
      </noscript>
    </div>
  </nav>
</template>
