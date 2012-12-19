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
    var time = Math.abs(this.time - new Date().getTime()).toString();
    // a simple log
    if (Core.isString(message) && !Core.isDefined(context))
        return Ti.API.log(time, '[' + message.toUpperCase() + ']');
    // converting might be needed.
    if (this.isObject(message) || this.isArray(message))
        message = Core.stringify(message, 1);
    else if (this.isArgument(message))
        message = Core.stringify(this.args(message), 1);
    return Ti.API.log(time,
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
 * @updated 2012/SEP/05 13:47 Héctor Menéndez <etor.mx@gmail.com>
 *			Module replication was not being set correclty.
 */
Core.load = function(name, args){
	if (!Type.isString(name)) return Core.error('sys:core:load:name');

	// FIXME : Type.isArray is broken on android
	if (typeof args != 'object') args = [];

	// this private method will convert a commonJS module to a instance.
	var mod2ins = function(module, args, name){
		if (!Type.isObject(module))
			return Core.error(name, 'sys:core:load:mod2ins:type');
		// pseudo instance
		var instance = function(){
			Core.log(args, 'sys:core:load:mod2ins:{' + name + '}');
			if (Type.isDefined(this.__construct)) {
				Core.log(name, 'sys:core:load:mod2ins:masterconstruct');
				this.__construct.apply(this, args);
				this.__construct = undefined;
			}
			return this.construct.apply(this, args);
		};
		// verify a constructor is defined
		if (!Type.isFunction(module.construct))
			return Core.error(name, 'sys:core:load:mod2ins:construct');
		var path = 'lib/' + Path.bundles + name, master = false;
		//
		var extend = function(e){
			for (var i in e) if (e.hasOwnProperty(i)) instance.prototype[i] = e[i];
		};
		// but wait, does a master file exist? if so, extend it.
		if (Path.exists(path + Path.extension)) extend(require(path));
		// convert module properties to instance properties.
		extend(module);
		return instance;
	};
	// Have to do this with try catches since Titanium is not consistent
	// with filesystem methods. (specially those with JS involved)
	var MVC = {
		file    : false,
		model   : false,
		view    : false,
		control : false
	};
	var path = Path.bundles + name;
	var i,p;
	for (i in MVC){
		p = (i == 'file')? path : path + '/' + i;
		if (!Path.exists(p  + Path.extension)){
			Core.log(name, 'sys:core:load:notfound:{' + i + '}');
			continue;
		}
		MVC[i] = require(p);
		if (Type.isDefined(MVC[i].uri)) MVC[i].uri = undefined;
		if (!Type.isDefined(MVC[i].id)) MVC[i].id  = p;
		MVC[i] = mod2ins(MVC[i], args, i);
	}
	return MVC;
};

module.exports = Core;
