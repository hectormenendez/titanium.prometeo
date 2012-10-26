var ID = {};

var MD5 = require('sys/id/md5');

ID.UUID = MD5(Ti.Platform.id);

module.exports = ID;