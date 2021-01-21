const { getDate } = require("../../utils/date");

module.exports = async ({ $page, click: selector, date, type }) => {
  // 等待点击之后发起请求
  const [response] = await Promise.all([
    $page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url() === "https://gate.8btc.com/one-graph-auth/graphql"
    ),
    $page.click(selector),
  ]);

  // 等待数据
  const res = await response.json();

  // 解析数据
  const [data] = res.data.articleGraph.list.edges
    .map((item) => item.node.post)
    .filter((item) => {
      const isDate = getDate(0, item.postDate * 1000) === date;
      const isType = item.title.indexOf(type) != -1;
      return isDate && isType;
    });

  return data;
};
