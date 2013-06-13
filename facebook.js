var Core     = require('sys/core');
var Facebook = Core.Device.isApple ? require("facebook") : Ti.Facebook;
module.exports = Facebook;