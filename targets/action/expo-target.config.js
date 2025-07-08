/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = config => ({
  type: "action",
  icon: 'https://github.com/expo.png',
  colors: { TouchBarBezel: "#000000", },
  entitlements: { /* Add entitlements */ },
});