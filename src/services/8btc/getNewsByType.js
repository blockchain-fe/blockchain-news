const open = require("../../utils/open-url");
const { getDate } = require("../../utils/date");
const log = require("../../utils/log");
const getDataAfterClick = require("./getDataAfterClick");
const html2md = require("html-markdown");

const MAX_PAGE_NUMBER = 10;

module.exports = async ({ type, date = getDate() }) => {
  log.start("爬虫开始工作", `date: ${date}`, `type: ${type}`);

  let data;
  let news;

  await open("https://www.8btc.com/flash", async ($page) => {
    // 初始化点击
    const startClicks = [
      // 先点按钮【大事件】
      ".bbt-tab__menu > li:nth-of-type(2)",
      // 再点按钮【7x24】
      ".bbt-tab__menu > li:nth-of-type(1)",
    ];

    for (let i = 0; i < startClicks.length; i++) {
      data = await getDataAfterClick({
        $page,
        click: startClicks[i],
        date,
        type,
      });

      log.print(
        `获取首页数据（第 ${i + 1} 次）`,
        `click: ${startClicks[i]}`,
        `data: ${data && JSON.stringify(data)}`
      );
    }

    // 点击更多按钮，继续查找数据
    const nextClick = ".more-wrap > button";
    for (let i = 0; !data && i < MAX_PAGE_NUMBER; i++) {
      data = await getDataAfterClick({
        $page,
        click: nextClick,
        date,
        type,
      });

      log.print(
        `获取翻页数据（第 ${i + 1} 次）`,
        `click: ${nextClick}`,
        `data: ${data && JSON.stringify(data)}`
      );
    }

    if (!data) {
      log.print("没有找到数据", `date: ${date}`, `type: ${type}`);
      return;
    }

    // 数据处理
    news = html2md
      .html2mdFromString(data.content)
      // 根据序号把新闻内容分割成数组
      .match(/\d+\.[^\n]*/g)
      // 去掉序号，只保留文字
      .map((item) => item.trim().replace(/^\d+\.\s*/, ""));

    log.print("数据处理成功", `news: ${JSON.stringify(news)}`);
  });

  return news;
};
