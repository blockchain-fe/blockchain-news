const getNewsByType = require("../services/8btc/getNewsByType");
const sendToDing = require("../services/dingtalk/send");
const { getDate } = require("../utils/date");

const token = process.env.DD_TOKEN;

(async () => {
  const news1 = await getNewsByType({ type: "巴比特早班车" });

  const news2 = await getNewsByType({
    type: "巴比特晚间",
    date: getDate(-1),
  });

  const news3 = await getNewsByType({
    type: "巴比特午间",
    date: getDate(-1),
  });

  const getContent = (news) => {
    if (news) {
      return news.map((item, i) => `##### ${i + 1}. ${item}`).join("\n");
    }
  };

  if (news1 || news2 || news3) {
    const content = [getContent(news1), getContent(news2), getContent(news3)]
      .filter((item) => !!item)
      .join("\n---\n");

    await sendToDing({
      token,
      isAtAll: true,
      title: `新闻早报 ${getDate()} 🌏`,
      content,
    });
  }
})();
