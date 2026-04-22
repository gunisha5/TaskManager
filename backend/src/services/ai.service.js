const axios = require("axios");
const { createHttpError } = require("../middleware/errorMiddleware");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo";

const parseSuggestionResponse = (rawText) => {
  try {
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    return {
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.filter((tag) => typeof tag === "string")
        : [],
      subtasks: Array.isArray(parsed.subtasks)
        ? parsed.subtasks.filter((subtask) => typeof subtask === "string")
        : [],
    };
  } catch (_error) {
    return {
      tags: [],
      subtasks: [],
    };
  }
};

const suggestFromTitle = async (title) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw createHttpError(500, "Failed to generate AI suggestions");
  }

  const prompt = [
    "You are a productivity assistant.",
    `Task title: "${title}"`,
    "Return ONLY valid JSON in this exact format:",
    '{ "tags": ["tag1", "tag2"], "subtasks": ["step1", "step2"] }',
    "Rules:",
    "- Do not include markdown.",
    "- Do not include explanations.",
    "- Return strictly valid JSON only.",
    "- Suggest 2 to 5 short lowercase tags.",
    "- Suggest 2 to 6 practical subtasks.",
  ].join("\n");

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: DEFAULT_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const responseText =
      response?.data?.choices?.[0]?.message?.content || "";
    const parsed = parseSuggestionResponse(responseText);

    if (parsed.tags.length === 0 && parsed.subtasks.length === 0) {
      throw new Error("Invalid JSON payload from OpenRouter.");
    }

    return parsed;
  } catch (error) {
    const status = error?.response?.status;
    const details = error?.response?.data || error.message;
    console.error("OpenRouter API error:", status || "n/a", details);
    throw createHttpError(502, "Failed to generate AI suggestions");
  }
};

module.exports = {
  suggestFromTitle,
};
