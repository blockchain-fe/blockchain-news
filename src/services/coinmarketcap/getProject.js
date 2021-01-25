const open = require("../../utils/open-url");
const log = require("../../utils/log");

// https://www.npmjs.com/package/currency.js
const currency = require("currency.js");

// https://github.com/nefe/number-precision
const NP = require("number-precision");
NP.enableBoundaryChecking(false);

// 格式转换 $10,000.00 -> 10000.00
const money2number = (m) => {
  return currency(m, { symbol: "", separator: "" }).format();
};

// 格式转换 money -> X亿
const getE = (m) => {
  const n = money2number(m);
  const e = NP.round(NP.divide(n, 100000000), 2);
  const eFormat = currency(e, { symbol: "$", separator: "," }).format();
  return `${eFormat}亿`;
};

// 根据金额，计算比例
const moneyRate = (a, b) => {
  return (
    NP.times(NP.round(NP.divide(money2number(a), money2number(b)), 4), 100) +
    "%"
  );
};

module.exports = async (name) => {
  log.start("爬虫开始工作", `name: ${name}`);

  const data = {};

  await open(
    `https://coinmarketcap.com/currencies/${name}`,
    async ($page) => {
      const getValues = (selector) => {
        return $page.$$eval(selector, (nodes) => {
          return nodes.map((node) => node.innerText.replace(/\n/g, "").trim());
        });
      };

      const l1 = await getValues('div[class*="priceValue___"]');
      const l2 = await getValues('div[class*="priceValue___"] + span');
      const l3 = await getValues('span[class*="highLowValue___"]');
      const l4 = await getValues('div[class*="statsValue___"]');
      const l5 = await getValues(".full-width-layout > .container table td");
      const l6 = await getValues('div[class*="maxSupplyValue___"]');

      // 价格
      data.price = l1[0];

      // 涨跌幅
      data.change = l2[0];

      // 涨还是跌
      data.isUp = !!(await $page.$(
        'div[class*="priceValue___"] + span .icon-Caret-up'
      ));

      // 最低 (24H)
      data.lowPrice = l3[0];

      // 最高 (24H)
      data.highPrice = l3[1];

      // 总市值
      data.totalPrice = l4[0];
      data.totalPriceDisplay = getE(data.totalPrice);

      // 市值占比
      data.totalPriceRate = l5[4];

      // 交易量 (24H)
      data.deal = l4[2];
      data.dealDisplay = getE(data.deal);

      // 换手率
      data.dealRate = moneyRate(data.deal, data.totalPrice);

      // 币的流通量
      data.flow = l4[3].split(" ")[0];

      // 币的总个数
      data.maxFlow = l6[0];

      // 流通占比
      data.flowRate = moneyRate(data.flow, data.maxFlow);
    },
    { waitUntil: "domcontentloaded" }
  );

  log.print("获取数据成功", JSON.stringify(data));

  return data;
};
