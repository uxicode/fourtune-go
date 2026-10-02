import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { chartWithInterpretation, SajuValidationError } from "@fortune/saju-core"
import type { ChartRequestInput } from "@fortune/saju-core"

const app = new Hono()

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
)

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 60
const rateMap = new Map<string, { count: number; windowStart: number }>()

function getClientId(incoming: Request): string {
  return incoming.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local"
}

function allow(id: string): boolean {
  const now = Date.now()
  const row = rateMap.get(id)
  if (!row || now - row.windowStart > WINDOW_MS) {
    rateMap.set(id, { count: 1, windowStart: now })
    return true
  }
  if (row.count >= MAX_PER_WINDOW) return false
  row.count += 1
  return true
}

app.get("/health", (c) => c.json({ ok: true }))

app.post("/v1/charts", async (c) => {
  if (!allow(getClientId(c.req.raw)))
    return c.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, 429)
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: "JSON 본문이 필요합니다." }, 400)
  }
  if (!isChartRequestInput(body)) return c.json({ error: "필드 형식이 올바르지 않습니다." }, 400)
  try {
    const result = chartWithInterpretation(body)
    return c.json(result)
  } catch (e) {
    if (e instanceof SajuValidationError) return c.json({ error: e.message }, 400)
    throw e
  }
})

function isChartRequestInput(x: unknown): x is ChartRequestInput {
  if (!x || typeof x !== "object") return false
  const o = x as Record<string, unknown>
  return (
    (o.kind === "solar" || o.kind === "lunar") &&
    typeof o.year === "number" &&
    typeof o.month === "number" &&
    typeof o.day === "number" &&
    typeof o.hour === "number" &&
    typeof o.minute === "number" &&
    typeof o.timeUnknown === "boolean" &&
    (o.timeUnknown || (o.hour >= 0 && o.hour <= 23 && o.minute >= 0 && o.minute <= 59)) &&
    (o.kind === "solar" || typeof o.isLeapMonth === "boolean") &&
    (o.gender === "male" || o.gender === "female") &&
    (o.saeunFromYear === undefined || typeof o.saeunFromYear === "number") &&
    (o.mode === undefined || o.mode === "a" || o.mode === "b")
  )
}

const port = Number(process.env.PORT) || 3001
serve({ fetch: app.fetch, port }, () => {
  console.log(`@fortune/api listening on ${port}`)
})
