<script setup lang="ts">
import NavigationBar from "./NavigationBar.vue";

const {
  query = null,
  bookmark = null,
  csrftoken = null,
} = defineProps(["query", "bookmark", "csrftoken"]);
</script>

<template>
  <div
    class="flex flex-col gap-5 w-screen min-h-screen max-w-7xl m-auto justify-center items-center p-5"
  >
    <aside
      class="w-full sticky top-5 pt-3 px-2 bg-[var(--colors-navbar-bg)] backdrop-blur-xl rounded-xl"
    >
      <NavigationBar
        :bookmark="bookmark"
        :csrftoken="csrftoken"
        :query="query"
      />
    </aside>
    <main
      class="flex flex-col gap-2 flex-wrap items-center w-full justify-center m-auto"
    >
      <slot />
    </main>
  </div>
</template>
