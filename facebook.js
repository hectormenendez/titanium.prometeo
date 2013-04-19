var Core     = require('sys/core');

var API = Core.Device.isApple ? require("facebook") : Ti.Facebook;

var Facebook = {};
Facebook = API;

module.exports = Facebook;