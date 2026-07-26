export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
  try {
    const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_recipes?select=*`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });
    const cloudRecipeList = await dbResponse.json();
    return res.status(200).json(cloudRecipeList);
  } catch (err) {
    return res.status(200).json([]);
  }
}