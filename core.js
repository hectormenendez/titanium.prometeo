/**
 * Record the first time this file is loaded as soon as possible
 * @see exports.log
 */
exports.time = new Date().getTime();

var Path   = require('sys/core/path');
var Obj    = require('sys/core/object');
var Type   = require('sys/core/type');

if (!Path.exists('config')) throw 'A configuration file must exist.';

var Config = require('config').core;
if (typeof Config != 'object') Config = {

    /**
     * Which version of Prometeo are we working on.
     */
    version : 0.1,

    /**
     * Do we need to be verbose?
     */
    debug : false
};


/**
 * Make Module available through Core.
 */
exports.config = Config;

/**
 * Make Path module available through Core.
 */
exports.path = Path;

/**
 * Make Object module methods silently available through core.
 */
Obj.extend(exports, Obj);

/**
 * Make Type module methods, silently available through core.
 */
Obj.extend(exports, Type);

/**
 * Overcomes a titanium bug with arguments keyword not being iterable,
 * this method converts the object to an array.
 */
exports.args = function(args){
    return Array.prototype.slice.call(args);
};

/**
 * Throws an error.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2011/JUL/31 12:31
 */
exports.error = function(message, title){
    title   = typeof title   == 'string'? title   : 'Error';
    message = typeof message == 'string'? message : 'Unknown';
    throw   title + ': ' + message;
};

/**
 * Logs based upon Config debug option.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/JUL/31 12:15
 */
exports.log = function(message, context){
    if (!Config.debug) return false;
    if (this.isObject(message) || this.isArray(message))
        message = JSON.stringify(message);
    else if (this.isArgument(message))
        message = JSON.stringify(this.args(message));
    return Ti.API.log(
        Math.abs(this.time - new Date().getTime()).toString(),
        '[' + (typeof context == 'string'? context.toUpperCase() : 'LOG') + '] ' +
        (typeof message == 'string'? message : '')
    );
};


/**
 * Instantiates an application file.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created  2011/NOV/21 14:33
 * @updated  2012/JUL/31 13:10   Now using commonJS
 */
exports.load = function(args){
    // connvert arguments to an array
    if (args.length < 1 || typeof args[0] != 'string')
        return exports.error('sys:core:load:args');
    // include file
    var file = args.shift();
    if (!Path.exists(Path.app + file))
        return exports.error('sys:core:load:file');
    var fn = require(Path.app + file);
    // verify a constructor is defined
    if (typeof fn.constructor != 'function')
        return exports.error('sys:core:load:constructor');
    // duplicate constructor, so we can pass arguments to instantiated class.
    var factory = function(){
        exports.log([fn, args], 'sys:core:load');
        return fn.constructor.apply(this, args);
    };
    factory.prototype = fn.constructor.prototype;
    factory.prototype.id = file;
    delete fn;
    return factory;
};
