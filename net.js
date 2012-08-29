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
        action = action.toUpperCase();
        message = Core.stringify(message).replace(/(\s|\\n)+/g, '');
        message = message.replace(/\\\"+/g,'"');
        Core.log('['+ action +'] ' + message, 'xhr');
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
    };

    xhr.onerror = function(){
        obj.error.call(this, this.responseText);
        log(this, 'error');
    };

    xhr.onreadystatechange = function(){
        log(this, 'state ' + this.readyState);
        if (this.readyState !== 4 || this.status !== 200) return false;
        obj.success.call(this, this.responseText);
        log(this, 'success');
    };

    log(obj.url, obj.type);
    log(obj.data, 'data');
    xhr.open(obj.type, obj.url);

    // setup headers
    xhr.setRequestHeader('X-HTTP-Method-Override', obj.type);
    if (Core.count(obj.header)) for (var name in obj.header){
        log(name + ': ' + obj.header[name], 'header');
        xhr.setRequestHeader(name, obj.header[name]);
    }

    xhr.send(obj.data);

    return xhr;
};
