const getNewsByType = require("../services/8btc/getNewsByType");
const sendToDing = require("../services/dingtalk/send");

const token = process.env.DD_TOKEN;

(async () => {
  const news = await getNewsByType({ type: "巴比特午间" });

  if (news) {
    const content = news.map((item, i) => `### ${i + 1}. ${item}`).join("\n");

    await sendToDing({
      token,
      isAtAll: true,
      title: "午间新闻 🌏",
      content,
    });
  }
})();
