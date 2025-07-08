/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = config => ({
  type: "widget",
  icon: 'https://github.com/expo.png',
  entitlements: {
    appGroups: ["group.com.ripgrim.shopifyiosboilerplate"],
  },

  colors: {
    text: {
      light: "#FFFFFF",
      dark: "#000000",
    },
    background: {
      light: "#FFFFFF",
      dark: "#0A0A0F",
    },
  },
});