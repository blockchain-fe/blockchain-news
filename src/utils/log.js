module.exports = {
  start(title, ...args) {
    console.log(`
    @   ${title}  ========================================
`);
    args.forEach((item) => {
      console.log(`        ${item}\n`);
    });
  },
  print(title, ...args) {
    console.log(`
    *   ${title}
`);
    args.forEach((item) => {
      console.log(`        ${item}\n`);
    });
  },
};
