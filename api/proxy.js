export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("仅支持POST请求", { status: 405 });
  }
  const key = process.env.DEEPSEEK_KEY;
  // 密钥为空直接返回提示
  if (!key || key.trim() === "") {
    return Response.json({msg:"Vercel未读取到密钥"},{status:500})
  }
  try {
    const payload = await req.json();
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key.trim()}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({msg:"中转服务异常", err:error.message},{status:500})
  }
}