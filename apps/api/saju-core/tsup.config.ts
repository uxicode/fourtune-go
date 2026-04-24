import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  outDir: "dist",
  /** Node 런타임에서 CJS/ESM 인터롭 이슈를 피하려고 manseryeok 소스는 번들에 포함 */
  noExternal: ["manseryeok"],
})
