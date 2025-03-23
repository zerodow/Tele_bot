const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.get("/", (_, res) => res.send("Bot webhook đang hoạt động."));

app.post("/github-webhook", async (req, res) => {
  const body = req.body;

  const branch = body.ref?.split("/").pop();
  if (branch !== "dev")
    return res.status(200).send("Không phải nhánh dev, bỏ qua.");

  const pusher = body.pusher?.name;
  const repo = body.repository?.name;
  const commits = body.commits
    ?.map((c) => `- ${c.message} (${c.id.slice(0, 7)})`)
    .join("\n");

  const message = `📦 Push mới vào *dev* của *${repo}*\n👤 *${pusher}* đã đẩy:\n${commits}`;
  console.log("message", message);
  console.log("TELEGRAM_BOT_TOKEN", TELEGRAM_BOT_TOKEN);
  console.log("TELEGRAM_CHAT_ID", process.env.TELEGRAM_CHAT_ID);
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }
    );
    res.status(200).send("✅ Đã gửi Telegram");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("❌ Gửi Telegram lỗi");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server chạy tại cổng ${PORT}`));
