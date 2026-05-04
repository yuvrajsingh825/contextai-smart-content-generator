// In dev: uses Vite proxy (/api → localhost:5000)
// In production (Vercel): calls Render backend directly
const BASE_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}`
  : "/api";

export const CONTENT_TEMPLATES = {
  blog: "Write a high-quality SEO-optimized blog post about {topic}. Target Audience: {audience}. Call to Action: {cta}. Included keywords: {keywords}. Tone: {tone}. Structure: Introduction, 3-4 subheadings, Conclusion.",
  linkedin: "Write a professional and engaging LinkedIn post about {topic}. Target Audience: {audience}. Included keywords: {keywords}. Tone: {tone}. Use relevant line breaks and 3-5 hashtags.",
  instagram: "Write a catchy Instagram caption for {topic}. Included keywords: {keywords}. Tone: {tone}. Include engaging emojis and 5-10 hashtags.",
  resume: "Write a powerful professional resume summary for a candidate specializing in {topic}. Included keywords: {keywords}. Tone: {tone}. Focus on quantifiable achievements and skills.",
  ad: "Create high-converting ad copy for Facebook and Google for the product {topic}. Included keywords: {keywords}. Tone: {tone}. Focus on benefits and include a strong call to action: {cta}.",
  product: "Write a compelling product description for {topic}. Included keywords: {keywords}. Tone: {tone}. Highlight key features and benefits.",
  social: "Generate 5 engaging social media posts for {topic}. Included keywords: {keywords}. Tone: {tone}. Use emojis and relevant hashtags.",
  email: "Draft a 3-part email sequence for {topic}. Included keywords: {keywords}. Tone: {tone}. Aim for high open rates and clicks."
};

// 🔥 COMMON BACKEND CALL
async function callBackend(prompt: string) {
  try {
    const response = await fetch(`${BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    // 🔴 handle error properly
    if (!response.ok) {
      const err = await response.text();
      console.error("❌ Server Error:", err);
      try {
        const jsonErr = JSON.parse(err);
        throw new Error(jsonErr.error || `Server error ${response.status}`);
      } catch {
        throw new Error(`Server error ${response.status}`);
      }
    }

    const data = await response.json();

    if (!data?.text) {
      throw new Error("Invalid response from backend");
    }

    return data.text;

  } catch (error: any) {
    console.error("❌ Fetch Error:", error.message);
    throw new Error(error.message || "Backend connection failed");
  }
}

// ✅ GENERATE
export async function generateContent(
  type: keyof typeof CONTENT_TEMPLATES,
  topic: string,
  keywords: string,
  tone: string,
  extra?: { audience?: string; cta?: string }
) {
  const template = CONTENT_TEMPLATES[type];

  if (!template) {
    throw new Error(`Content type "${type}" not supported`);
  }

  const prompt = template
    .replace(/{topic}/g, topic || "General Topic")
    .replace(/{keywords}/g, keywords || "No keywords")
    .replace(/{tone}/g, tone || "Professional")
    .replace(/{audience}/g, extra?.audience || "General Audience")
    .replace(/{cta}/g, extra?.cta || "Learn more");

  return callBackend(prompt);
}

// ✅ SUMMARY
export async function summarizeContent(content: string) {
  if (!content) return "No content to summarize.";

  const prompt = `Summarize in 4-6 bullet points:\n${content}`;

  return callBackend(prompt);
}