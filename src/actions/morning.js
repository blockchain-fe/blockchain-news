const getNewsByType = require("../services/8btc/getNewsByType");
const sendToDing = require("../services/dingtalk/send");

const token = process.env.DD_TOKEN;

(async () => {
  const news = await getNewsByType({ type: "巴比特早班车" });

  if (news) {
    const content = news.map((item, i) => `### ${i + 1}. ${item}`).join("\n");

    await sendToDing({
      token,
      isAtAll: true,
      title: "早啊！新闻来了 🤗",
      content,
    });
  }
})();
