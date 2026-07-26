export default async function handler(req) {
  if (req.method !== "POST") return new Response("仅支持POST请求", { status: 405 })
  const DEEPSEEK_KEY = process.env.DEEPSEEK_KEY
  const body = await req.json()
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_KEY}`
    },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  return Response.json(data)
}