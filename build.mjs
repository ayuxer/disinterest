import { build } from "esbuild";

build({
  plugins: [
    {
      name: "external-packages",
      setup(build) {
        build.onResolve({ filter: /^[^./]|^\.[^./]|^\.\.[^/]/ }, (args) => ({
          path: args.path,
          external: true,
        }));
      },
    },
  ],
  format: "esm",
  platform: "node",
  target: ["esnext"],
  bundle: true,
  minify: false,
  entryPoints: ["server/http.ts"],
  outfile: "dist/index.mjs",
  sourcemap: "linked",
  logLevel: "info",
  treeShaking: true,
});
