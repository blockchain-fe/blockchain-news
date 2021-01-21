const getProject = require("../services/qkl123/getProject");
const sendToDing = require("../services/dingtalk/send");
const { getDate } = require("../utils/date");

const token = process.env.DD_TOKEN;

(async () => {
  const getContent = (data) => {
    const priceColor = data.change[0] === "+" ? "#FF0000" : "#008000";
    return `### ${data.name}
#### 当前价：<font color="${priceColor}">${data.price}（${data.change}）</font>
#### 最高/最低(24H)：${data.highPrice}/${data.lowPrice}
#### 成交量(24H)：<font color="#9932CC">${data.deal}（换手率 ${data.dealRate}）</font>
#### 总市值：${data.totalPrice}（占比 ${data.totalPriceRate}）
#### 流通量/总量：${data.flow}（占比 ${data.flowRate}）`;
  };

  const btc = await getProject("btc");
  const eth = await getProject("eth");
  const content = [getContent(btc), getContent(eth)].join("\n---\n");

  await sendToDing({
    token,
    isAtAll: true,
    title: `最新行情 ${getDate()} 💰`,
    content,
  });
})();
