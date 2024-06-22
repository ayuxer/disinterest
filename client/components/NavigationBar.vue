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
    class="w-full px-2 flex flex-col gap-2 md:flex-row flex-wrap text-center justify-between items-center pb-3"
  >
    <a
      href="/"
      class="text-main-background text-3xl font-playful font-extrabold pointer-events-auto bg-accent pl-4 pr-5 py-1 rounded-full"
    >
      d
    </a>
    <form action="/search/pins" method="GET">
      <fieldset class="flex flex-row gap-3 items-center justify-center w-full">
        <label
          class="flex flex-row items-center justify-between bg-[var(--colors-navbar-bg-alt)] shadow-md px-4 py-3 rounded-full"
        >
          <button type="submit">
            <MagnifyingGlassIcon
              class="size-5 [&>path]:stroke-[4] text-foreground-alt mr-2"
            />
          </button>
          <input
            class="peer inline-block bg-transparent text-main-foreground placeholder:text-foreground-alt focus:outline-none text-sm placeholder:text-sm"
            type="search"
            name="q"
            placeholder="Search for pins"
            tabindex="0"
            required
          />
          <button
            class="peer-invalid:opacity-0"
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
    </div>
  </nav>
</template>
