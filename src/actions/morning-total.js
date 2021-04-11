const getNewsByType = require("../services/8btc/getNewsByType");
const sendToDing = require("../services/dingtalk/send");
const { getDate } = require("../utils/date");

const token = process.env.DD_TOKEN;

(async () => {
  const n1 = await getNewsByType({
    type: "巴比特早班车",
  });

  const n2 = await getNewsByType({
    type: "巴比特晚间",
    date: getDate(-1),
  });

  const n3 = await getNewsByType({
    type: "巴比特午间",
    date: getDate(-1),
  });

  if (n1 || n2 || n3) {
    const news = [...(n1 || []), ...(n2 || []), ...(n3 || [])];
    const content = news
      .filter((item) => !!item)
      .map((item, i) => `##### ${i + 1}. ${item}`)
      .join("\n");

    await sendToDing({
      token,
      title: `新闻早报 ${getDate()} 🌏`,
      content,
    });
  }
})();
