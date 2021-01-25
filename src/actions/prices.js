const getProject = require("../services/coinmarketcap/getProject");
const sendToDing = require("../services/dingtalk/send");
const { getDate } = require("../utils/date");

const token = process.env.DD_TOKEN;

(async () => {
  const getContent = (name, data) => {
    const priceColor = data.isUp ? "#FF0000" : "#008000";
    const changeBefore = data.isUp ? "+" : "-";
    return `### ${name}
##### 当前价：<font color="${priceColor}">${data.price}（${changeBefore}${data.change}）</font>
##### 最高(24H)：${data.highPrice}
##### 最低(24H)：${data.lowPrice}
##### 成交量(24H)：<font color="#9932CC">${data.dealDisplay}</font>
##### 换手率：<font color="#9932CC">${data.dealRate}</font>
##### 总市值：${data.totalPriceDisplay}
##### 市值占比：${data.totalPriceRate}
##### 流通量：${data.flow}
##### 总量：${data.maxFlow}
##### 流通占比：${data.flowRate}`;
  };

  const btc = await getProject("bitcoin");
  const eth = await getProject("ethereum");

  const content = [
    getContent("比特币（BTC）", btc),
    getContent("以太坊（ETH）", eth),
  ].join("\n---\n");

  await sendToDing({
    token,
    isAtAll: true,
    title: `最新行情 ${getDate()} 💰`,
    content,
  });
})();
