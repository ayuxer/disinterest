<script>
import MasonryWall from "@yeger/vue-masonry-wall";

export { default } from "/:router.vue";

export const mount = "#root";

export function configure({ app, router }) {
  app.use(MasonryWall);
}
</script>
