import { useRouter } from "vue-router";

export default async (ctx) => {
  if (ctx.server) {
    ctx.state = {};
  }
};

export function state() {
  return {
    data: {
      results: [],
      query: "",
      bookmark: "null",
      csrftoken: "null",
    },
  };
}
