export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "仅支持POST请求" });
  }

  const QWEN_FULL_KEY = process.env.QWEN_FULL_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    const requestBody = await req.json();

    // 请求通义千问接口
    const aiResponse = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${QWEN_FULL_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    const aiResult = await aiResponse.json();
    console.log("千问原始返回数据：", aiResult);

    // 安全取值
    let recipeRawText = "";
    if (aiResult?.output?.choices?.[0]?.message?.content) {
      recipeRawText = aiResult.output.choices[0].message.content.trim();
    }

    // 容错解析JSON，防止格式错乱导致undefined
    let recipeData;
    try {
      recipeData = JSON.parse(recipeRawText);
    } catch (err) {
      return res.status(400).json({ msg: "AI返回数据格式错误，请重新生成" });
    }

    recipeData.id = "ai_" + Date.now();
    recipeData.img = "";

    // 写入Supabase数据库
    await fetch(`${SUPABASE_URL}/rest/v1/user_recipes`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify(recipeData)
    });

    return res.status(200).json(recipeData);
  } catch (error) {
    console.error("服务异常：", error);
    return res.status(500).json({ msg: "AI生成异常" });
  }
}