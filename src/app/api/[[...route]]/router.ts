import { Hono } from "hono"
import { cors } from "hono/cors"
import { handle } from "hono/vercel"

export const runtime = "edge"

const app = new Hono().basePath("/v1/api")

app.use("/*", cors())
app.use("/schedule", async (c) => {
  c.json({ message: "Hello, world!" })
})

app.post("/schedule", async (c) => {

})

export const GET = handle(app)
export const POST = handle(app)
export default app as never
