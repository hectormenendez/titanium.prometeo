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

/**
 * Load Core sub modules.
 */
var Path    = require('sys/core/path');
var Objects = require('sys/core/objects');
var Type    = require('sys/core/type');
var Device  = require('sys/core/device');

/**
 * Core configuration.
 * Sets default configuration, which would be overwritten by user's
 * {config}
 *
 * @created 2012/AGO/14 17:39 Héctor Menéndez <etor.mx@gmail.com>
 * @see     #config
 */
var Config = Objects.extend({

    // Minimal SDK version that the framework supports.
    SDK : 2.2,

    // Which version of Prometeo are we working on.
    version : 0.1,

    // Do we need to be verbose?
    debug : false

}, require('config').Core || {});

/**
 * Basic checkups.
 */
if (parseFloat(Ti.version) < 2.2)
    throw 'Unsupported Titanium version; please upgrade to at least v2.2';

//if (!Path.exists('config'))
//    throw 'A configuration file was not found.';

if (!Device.isSupported)
    throw 'The current device is not supported.'


/**
 * Path
 * {prop}   Makes Path module available through framework.
 *
 * @created 2012/AGO/14 17:42 Héctor Menéndez <etor.mx@gmail.com>
 */
Core.Path = Path;


/**
 * Device
 * {prop}   Makes Device module available through framework.
 *
 * @created 2012/AGO/28 16:45 Héctor Menéndez <etor.mx@gmail.com>
 */
Core.Device = Device;

/**
 * Object
 * {extend} Make Object module methods silently available through core.
 *
 * @created 2012/AGO/14 17:46 Héctor Menéndez <etor.mx@gmail.com>
 * @see     #sys/core/object
 */
Core = Objects.extend(Core, Objects);

/**
 * Type
 * {extend} Make Type module methods silently available through core.
 *
 * @created 2012/AGO/14 17:48 Héctor Menéndez <etor.mx@gmail.com>
 * @see     #sys/core/type
 */
Core = Objects.extend(Core, Type);

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
        message = Core.stringify(message, 1);
    else if (this.isArgument(message))
        message = Core.stringify(this.args(message), 1);
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
    //if (!Path.exists(Path.app + file))
    //    return Core.error(file, 'sys:core:load:file');
    var fn = require(Path.app + file);
    // verify a constructor is defined
    if (typeof fn.construct != 'function')
        return Core.error(file, 'sys:core:load:construct');
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
