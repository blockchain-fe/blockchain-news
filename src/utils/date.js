const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

module.exports = {
  // 获取日期
  getDate(offset = 0, timestamp = Date.now()) {
    return dayjs(timestamp)
      .utc()
      .add(offset, "day")
      .add(8, "hour")
      .format("YYYY-MM-DD");
  },
  // 获取时间
  getTime(offset = 0, timestamp = Date.now()) {
    return dayjs(timestamp)
      .utc()
      .add(offset, "day")
      .add(8, "hour")
      .format("YYYY-MM-DD HH:mm:ss");
  },
};
