/**
 *      ______
 *     / ____/___  ________
 *    / /   / __ \/ ___/ _ \
 *   / /___/ /_/ / /  /  __/
 *   \____/\____/_/   \___/
 *
 * {file}   Basic and not specialized functionality.
 *
 * @created 2012/AGO/14 17:31 Héctor Menéndez <etor.mx@gmail.com>
 * @log     Added Documentation.
 **/
var Core = {};

/**
 * Main timer
 * {prop}   Records the first time this file is loaded as soon as possible
 *
 * @see     #sys/core.log
 */
Core.time = new Date().getTime();

var Path = require('sys/core/path');
var Obj  = require('sys/core/object');
var Type = require('sys/core/type');

if (!Path.exists('config')) throw 'A configuration file must exist.';

/**
 * {config}
 *
 * @created 2012/AGO/14 17:39 Héctor Menéndez <etor.mx@gmail.com>
 * @see     #config
 */
Config = Obj.extend({

    // Which version of Prometeo are we working on.
    version : 0.1,

    // Do we need to be verbose?
    debug : false

}, require('config').core || {});


/**
 * Path
 * {prop}   Makes Path module available through framework.
 *
 * @created 2012/AGO/14 17:42 Héctor Menéndez <etor.mx@gmail.com>
 */
Core.Path = Path;

/**
 * Object
 * {extend} Make Object module methods silently available through core.
 *
 * @created 2012/AGO/14 17:46 Héctor Menéndez <etor.mx@gmail.com>
 * @see     #sys/core/object
 */
Core = Obj.extend(Core, Obj);

/**
 * Type
 * {extend} Make Type module methods silently available through core.
 *
 * @created 2012/AGO/14 17:48 Héctor Menéndez <etor.mx@gmail.com>
 * @see     #sys/core/type
 */
Core = Obj.extend(Core, Type);

/**
 * Argument Handler
 * {method} Overcomes a titanium bug with arguments keyword not being iterable,
 *
 * @param   {object} args: The original arguments object.
 *
 * @returns {array} Arguments object, converted to array.
 * @created 2012/AGO/14 17:51 Héctor Menéndez <etor.mx@gmail.com>
 */
Core.args = function(args){
    return Array.prototype.slice.call(args);
};

/**
 * Error Handler
 * {method} Throws an error, halting execution.
 *
 * @param   {string} message:   The message to be displayed (Unknown by default)
 * @param   {string}   title:   The Title for the error. (Error by default)
 *
 * @note    It's highly encouraged to use the following format for the message:
 *          {path:to}:{file}:{method}:{keyword}
 *
 * @created Héctor Menéndez <etor.mx@gmail.com> 2011/JUL/31 12:31
 */
Core.error = function(message, title){
    title   = typeof title   == 'string'? title   : 'Error';
    message = typeof message == 'string'? message : 'Unknown';
    throw   title + ': ' + message;
};

/**
 * Logger
 * {method} Logs based upon Config debug option.
 *
 * @param   {string} message:   The message to be sent to the logger.
 * @param   {string} context:   A context to facilitate user finding the log source.
 *
 * @note    As with Core.error, is ecouraged to add the following format as context:
 *          {path:to}:{file}:{action}
 *
 * @created 2012/JUL/31 12:15 Héctor Menéndez <etor.mx@gmail.com>
 */
Core.log = function(message, context){
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
 * Application loader
 * {method} Loads a file from the application folder as if it was a module and
 *          runs a custom constructor
 *
 * @param   {array}*    An array of arguments to be sent to the constructor,
 *                      The first one must be a string, with the app name.
 *
 * @created 2011/NOV/21 14:33 Héctor Menéndez <etor.mx@gmail.com>
 * @updated 2012/JUL/31 13:10 Héctor Menéndez <etor.mx@gmail.com>
 *
 * @log     Now using commonJS
 */
Core.load = function(args){
    // connvert arguments to an array
    if (args.length < 1 || typeof args[0] != 'string')
        return Core.error('sys:core:load:args');
    // include file
    var file = args.shift();
    if (!Path.exists(Path.app + file))
        return Core.error('sys:core:load:file');
    var fn = require(Path.app + file);
    // verify a constructor is defined
    if (typeof fn.construct != 'function')
        return Core.error('sys:core:load:constructor');
    // duplicate constructor, so we can pass arguments to instantiated class.
    var factory = function(){
        Core.log([fn, args], 'sys:core:load');
        return fn.construct.apply(this, args);
    };
    factory.prototype = fn.construct.prototype;
    factory.prototype.id = file;
   // fn = undefined;
    return factory;
};

module.exports = Core;
