var Core = require('sys/core');

var Config = require('config');

/**
 * Make an XML HTTP Request.
 *
 * TODO: Write documentation.
 */
exports.xhr = function(obj){

	var config = Core.isDefined(Config.Net)? Config.Net : { timeout : 5000 };

	if (typeof obj != 'object') return Core.error('sys:net:xhr:object');
	if (typeof obj.success != 'function') obj.success = function(){};
	if (typeof obj.load    != 'function') obj.load    = function(){};
	if (typeof obj.error   != 'function') obj.error   = function(){};
	if (typeof obj.header  != 'object')   obj.header  = {};
	if (typeof obj.data    != 'string')   obj.data    = '';
	if (typeof obj.url     != 'string')   obj.url     = '';
	// type's string; Enforce uppercase 'n make sure we get correct transfer type
	if ( typeof obj.type != 'string' ||  ((obj.type = obj.type.toUpperCase()) && (
			obj.type != 'POST'   &&
			obj.type != 'GET'    &&
			obj.type != 'DELETE' &&
			obj.type != 'PUT'
		)))
		return Core.error('sys:net:xhr:type');

	// url's string; must only contain a-z
	if (typeof obj.url != 'string' ) return Core.error('sys:net:xhr:url');

	var log = function(message, action){
		message = Core.stringify(message).replace(/(\s|\\n)+/g, '');
		message = message.replace(/\\\"+/g,'"');
		Core.log(message, 'sys:net:xhr:{'+ action +'}');
	};

	// setup connection
	var xhr  = Ti.Network.createHTTPClient({
		// This has to be set to something slighty higher than our timeout
		// otherwise the default timeout value will trigger.
		timeout                    : parseInt(config.timeout*1.2,10),
		enableKeepAlive            : false,
		validatesSecureCertificate : false
	});

	var interval;
	var timer = new Date().getTime();
	var tmp;

	var timeout = function(){
		tmp = this;
		interval = setInterval(function(){
			var ti = config.timeout - Math.abs(timer - new Date().getTime());
			if (ti > 0 && tmp.readyState < 4) return;
			clearInterval(interval);
			if (tmp.status !== 0) return;
			tmp.abort();
			tmp.status = 1; // our definition of timeout.
			xhr.onerror.call(tmp);
		}, 100);
	};

	xhr.onload = function(){
		log(this, 'loaded');
		obj.load.call(this, this.responseText);

		// TODO : Apple triggers onreadystate 4 only once (as it should, android does not.)
		if (Core.Device.isApple || this.readyState !== 4 || this.status !== 200)
			return false;
		log(this, 'success');
		obj.success.call(this, this.responseText);
	};

	xhr.onerror = function(){
		log(this, 'error');
		obj.error.call(this, this.responseText);
	};

	xhr.onreadystatechange = function(e){
		if (this.readyState === 1) timeout.call(this);
		else tmp = this;
		log(this, 'state ' + this.readyState);
		if (interval && this.readyState === 4) clearInterval(interval);
		// TODO : Apple triggers onreadystate 4 only once (as it should, android does not.)
		if (Core.Device.isAndroid || this.readyState !== 4 || this.status !== 200)
			return false;
		log(this, 'success');
		obj.success.call(this, this.responseText);
	};

	log(obj.url, obj.type);
	xhr.open(obj.type, obj.url);

	// setup headers
	xhr.setRequestHeader('X-HTTP-Method-Override', obj.type);
	if (Core.count(obj.header)) for (var name in obj.header){
		log(name + ': ' + obj.header[name], 'header');
		xhr.setRequestHeader(name, obj.header[name]);
	}

	log(obj.data, 'data');
	xhr.send(obj.data);

	return xhr;
};
