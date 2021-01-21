const open = require("../../utils/open-url");
const log = require("../../utils/log");

module.exports = async (name) => {
  log.start("爬虫开始工作", `name: ${name}`);

  const data = {};

  await open(`https://www.qkl123.com/project/${name}`, async ($page) => {
    const $title = await $page.$(".detail-header__title");
    const $volume = await $page.$(".detail-header__volume");
    const $right = await $page.$(".detail-header__right");

    const getValue = ($e, selector) => {
      return $e.$eval(selector, (node) =>
        node.innerText.replace(/\n/g, "").trim()
      );
    };

    // 名称
    data.name = await getValue($title, "h1");

    // 基本信息
    data.price = await getValue($volume, ".volume-value");
    data.change = await getValue($volume, ".volume-change");
    data.highPrice = await getValue($volume, ".volume-high > span");
    data.lowPrice = await getValue($volume, ".volume-low > span");

    // 其它信息
    data.totalPrice = await getValue(
      $right,
      "div:nth-of-type(1) > .project-attr__value"
    );
    data.totalPriceRate = await getValue(
      $right,
      "div:nth-of-type(2) > .project-progress__value"
    );
    data.deal = await getValue(
      $right,
      "div:nth-of-type(3) > .project-attr__value"
    );
    data.dealRate = await getValue(
      $right,
      "div:nth-of-type(4) > .project-progress__value"
    );
    data.flow = await getValue(
      $right,
      "div:nth-of-type(5) > .project-attr__value"
    );
    data.flowRate = await getValue(
      $right,
      "div:nth-of-type(6) > .project-progress__value"
    );
  });

  log.print("获取数据成功", JSON.stringify(data));

  return data;
};
