import { Telegraf } from "telegraf";
import axios from "axios";
import "dotenv/config"; // dùng biến môi trường từ file .env

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    ctx.reply(reply);
  } catch (error) {
    console.error(
      "❌ Error from OpenAI:",
      error.response?.data || error.message
    );
    ctx.reply("Có lỗi xảy ra khi gọi ChatGPT!");
  }
});

bot.launch();
console.log("🤖 Bot đang chạy...");
