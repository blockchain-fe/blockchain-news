const { Wechaty } = require("wechaty");
const qr = require("qrcode-terminal");

const bot = new Wechaty({
  name: "xiong",
});

bot.on("scan", (qrcode) => {
  qr.generate(qrcode);
});

bot.on("login", (user) => {
  console.log(`${user} 登录了`);
});

bot.on("logout", (user) => {
  console.log(`${user} 退出了`);
});

bot
  .start()
  .then(() => console.log("开始登录微信"))
  .catch((e) => console.error(e));
