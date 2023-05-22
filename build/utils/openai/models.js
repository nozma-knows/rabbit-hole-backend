"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatGPT = void 0;
const { OpenAI } = require("langchain");
function chatGPT(temp) {
    const model = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: temp || 0,
        modelName: "gpt-3.5-turbo",
    });
    return model;
}
exports.chatGPT = chatGPT;
