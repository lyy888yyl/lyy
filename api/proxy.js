export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "仅支持POST请求" });
  }
  const QWEN_FULL_KEY = process.env.QWEN_FULL_KEY;
  try {
    const requestBody = await req.json();
    const aiResponse = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${QWEN_FULL_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    const aiResult = await aiResponse.json();
    let content = aiResult?.output?.choices?.[0]?.message?.content || "";
    const recipeData = JSON.parse(content.trim());
    recipeData.id = "ai_" + Date.now();
    recipeData.img = "";
    return res.status(200).json(recipeData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "AI生成失败" });
  }
}