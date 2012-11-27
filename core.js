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
 
var Core = {
    time : new Date().getTime() // Records time Core first loaded
};

/**
 * MODULES
 */
var Objects = require('sys/core/objects');
var Type    = require('sys/core/type');
var Path    = require('sys/core/path');
var Device  = require('sys/core/device');
var Config  = require('sys/core/config');
var Style   = require('sys/core/style');

/**
 * Core configuration.
 */
Core.config = Config('Core', {
    SDK     : 2.2,   // Minimal SDK version that the framework supports.
    version : 0.1,   // Which version of Prometeo are we working on.
    debug   : true   // Do we need to be verbose?
});

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
    title   = Type.isString(title)   ? title   : 'Error';
    message = Type.isString(message) ? message : 'Unknown';
    throw title + '\n\n' + message + '\n';
};

/**
 * Logger
 * {method} Logs based upon Config debug option.
 *
 * @param   {string} message:   The message to be sent to the logger.
 * @param   {string} context:   A context to facilitate user finding the log source.
 *
 * @note    It's encouraged to add the following format as context:
 *          {path:to}:{file}:{action}
 *
 * @created 2012/JUL/31 12:15 Héctor Menéndez <etor.mx@gmail.com>
 * 
 * FIXME: Review all logging, there must be a more organized way of doing this. 
 */
Core.log = function(message, context){
    if (!Core.config.debug) return false;
    var time = Math.abs(this.time - new Date().getTime()).toString();
    // a simple log
    if (Type.isString(message) && !Type.isDefined(context))
        return Ti.API.log(time, '[' + message.toUpperCase() + ']');
    // converting might be needed.
    if (Type.isObject(message) || Type.isArray(message))
        message = Objects.stringify(message, 1);
    else if (Type.isArgument(message))
        message = Objects.stringify(this.args(message), 1);
    return Ti.API.log(time,
        '[' + (typeof context == 'string'? context.toUpperCase() : 'LOG') + '] ' +
        (typeof message == 'string'? message : '')
    );
};

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
 * CommonJS safe require.
 * Exact same behaviour as require, just making sure the file exists. 
 */
Core.require = function(path){
    var file = Path.exists(path + Path.extension);
    if (!file) return Core.error(path, 'sys:core:require:notfound');
    return require(path);
};

/******************************************************************************
 * Basic checkups.
 */
if (parseFloat(Ti.version) < Core.config.SDK)
    Core.error('Unsupported Ti version; Upgrade to at least v'+ Core.config.SDK);

if (!Device.isSupported)
    Core.error('The current device is not supported.');

/**
 * Update parsed stylesheets
 */
var StyleLib = require('sys/style/lib');
Core.log('sys:core:stylesheet:lib');
Objects.each(Style.extend('style.css', 'lib/style.css'), function(key, val){
	StyleLib[key] = val;
});

var StyleApp = require('sys/style/app');
Core.log('sys:core:stylesheet:app');
Objects.each(Style.extend('style.css', 'app/style.css'), function(key, val){
	StyleLib[key] = val;
});


module.exports = Core;