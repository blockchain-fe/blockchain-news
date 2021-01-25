const puppeteer = require("puppeteer");
const log = require("./log");

module.exports = async (url, fn, options) => {
  log.print("打开网站", url);

  // 启动浏览器
  const $browser = await puppeteer.launch();

  // 打开网站
  const $page = await $browser.newPage();
  await $page.goto(url, options);

  // 截图保存
  // await $page.screenshot({ path: "example.png" });

  // 执行操作
  await fn($page);

  // 关闭浏览器
  await $browser.close();
};
