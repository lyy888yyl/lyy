export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "仅支持POST请求" });
  }

  const QWEN_FULL_KEY = process.env.QWEN_FULL_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    const requestBody = await req.json();

    // 调用通义千问
    const aiResponse = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${QWEN_FULL_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    const aiResult = await aiResponse.json();
    const recipeRawText = aiResult.output.choices[0].message.content.trim();
    const recipeData = JSON.parse(recipeRawText);
    recipeData.id = "ai_" + Date.now();
    recipeData.img = "";

    // 写入数据库
    await fetch(`${SUPABASE_URL}/rest/v1/user_recipes`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        id: recipeData.id,
        name: recipeData.name,
        cate: recipeData.cate,
        food: recipeData.food,
        step: recipeData.step,
        img: recipeData.img
      })
    });

    return res.status(200).json(recipeData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "AI生成异常" });
  }
}