const { Wechaty } = require("wechaty");
const qr = require("qrcode-terminal");

const bot = new Wechaty({
  name: "xiong",
  puppet: "wechaty-puppet-wechat",
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

bot.on("ready", async () => {
  console.log(123);
  const rooms = await bot.Room.findAll();
  console.log(rooms);
});

bot.on("message", async (m) => {
  const room = m.room();
  const contact = m.from();
  const text = m.text();
  if (room) {
    const topic = await room.topic();
    console.log(`Room: ${topic}
Contact: ${contact.name()}
Text: ${text}`);
  } else {
    console.log(`Contact: ${contact.name()}
Text: ${text}`);
  }
});

// memory should be cryptoed by https://cryptojs.gitbook.io/docs/
bot
  .start()
  .then(console.log("初始化成功"))
  .catch((e) => console.error(e));
