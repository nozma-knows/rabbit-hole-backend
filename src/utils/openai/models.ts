const { OpenAI } = require("langchain");

export function chatGPT(temp?: number) {
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: temp || 0,
    modelName: "gpt-3.5-turbo",
  });

  return model;
}
