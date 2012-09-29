var Core = require('sys/core');

var Config = require('config').net;
if (typeof Config != 'object') Config = {

    /**
     * Miliseconds before assuming connection was unsuccesful.
     */
    timeout: 5000
};


/**
 * Make an XML HTTP Request.
 *
 * TODO: Write documentation.
 */
exports.xhr = function(obj){

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
        timeout                    : Config.timeout,
        enableKeepAlive            : false,
        validatesSecureCertificate : false
    });

    xhr.onload = function(){
        obj.load.call(this, this.responseText);
        log(this, 'loaded');
        // For some reason, Android is not triggering onreadystatechange
		// TODO: Fix this.
        if (Core.Device.isAndroid && this.status === 200){
        	obj.success.call(this, this.responseText);
        	log(this, 'success');
        }
    };

    xhr.onerror = function(){
        obj.error.call(this, this.responseText);
        log(this, 'error');
    };

    xhr.onreadystatechange = function(e){
        log(this, 'state ' + this.readyState);
        if (this.readyState !== 4 || this.status !== 200) return false;
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
