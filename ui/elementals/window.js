var Window = {};

var Core = require('sys/core');

Window.raw = Ti.UI.createWindow;

Window.construct = function(){
	//alert(this);
}

Window.open = function(){
	var args = Core.args(arguments);
	if (args.length)
		this.raw.open.apply(this.raw, args);
	else
		this.raw.open();
}

Window.close = function(){

}

module.exports = Window;