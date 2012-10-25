var Core = require('sys/core');

var Defaults = {};


/**
 * Obtain the raw titanium element from custom element.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/08 21:27
 * @updated 2012/AGO/30 12:20 Moved from util to local variable on defaults.
 * 							  TODO: find a way of sharing this method with both
 *                                  modules.
 */
var getTitanium = function(element){
    // custom element?
	if (Core.isElemental(element)) return element.raw;
    // native raw element, then?
    if (Core.isTitanium) return element;
    return Core.error('sys:ui:util:titanium:invalid');
};


/**
 * This will contain the Raw Titanium element.
 */
Defaults.raw = null;

/**
 * Add an element as a child.
 * @param {Mixed} element It can be either an Compound, elemental or even a Raw
 *                        Titanium element, also if a string is given, it will
 *                        automatize the child adding process, using the next
 *                        argument. TODO: Improve this documentation.
 * @param {Object} properties
 * @author Hector Menendez <etor.mx@gmail.com>
 * @created 2012/AGO/09 13:34
 * @updated 2012/AGO/31 04:21 Using Core.isObject to validate element.
 */
Defaults.add = function(element, properties){
    Core.log(element, 'sys:ui:util:defaults:add');
	// if an element is being sent, just add it with no auto variable.
    if (Core.isObject(element)){
        element = getTitanium(element);
        return this.raw.add(element);
    }
    // but if a string was sent, then the user wants us
    // to create an auto element.
	if (!Core.isString(element)) return Core.error(
		element + ': ' + typeof element,
		'sys:ui:util:defaults:add:type'
	);
	if (!Core.isObject(properties)) properties = {};
	// extract element name, class name, and variable name.
	var rx = /^([a-z][a-z0-9]+)(?:\.([a-z][a-z0-9]+))?(?:\#([a-z][a-z0-9]+))?$/im
	var match, className, sharpName;
	if (match = element.match(rx)){
		element   = match[1];
		className = Core.isDefined(match[2])? match[2] : undefined;
		sharpName = Core.isDefined(match[3])? match[3] : undefined;
		if (className)
			properties = Core.extend(properties, { 'class' : className });
	}
	var varName = '$' + (sharpName? sharpName : element + (className? '_' + className : ''));
	var UI = require('sys/ui');
	if (!Core.isFunction(UI[element]))
		return Core.error(element, 'sys:ui:util:defaults:add:notfound');
	this[varName] = UI[element](properties);
	this[varName].raw.titaniumName = sharpName? sharpName : undefined;
	this.add(this[varName]);
	return this[varName];
};

/**
 * Delete a child from element. TODO: Improve this Documentation.
 *
 * @param {Object} element
 * @author Hector Menendez <etor.mx@gmail.com>
 * @created 2012/AGO/09 13:43
 * @updated 2012/AGO/30 11:29 Moved it to its own module.
 */
Defaults.del = function(element){
    Core.log(element, 'sys:ui:util:defaults:del'); 
    element = getTitanium(element);
    if (!element) return Core.error('sys:ui:util:defaults:del:notelement');
    return this.raw.remove(element);
};

/**
 * Add an event to current element. TODO: Improve this documentation.
 *
 * @param {Object} e
 * @param {Object} callback
 * @author Hector Menendez <etor.mx@gmail.com>
 * @created 2012/AGO/09 14.23
 * @updated 2012/AGO/30 11:31 Moved it to its own module.
 */
Defaults.addEvent = function(e, callback){
    e = String(e);
    if (!Core.isFunction(callback))
        return Core.error('sys:ui:util:defaults:addevent:callback');
    Core.log(e, 'sys:ui:util:defaults:addevent');
    return this.raw.addEventListener(e, callback);
};

/**
 * Delete an event from current element. TODO: Improve this documentation.
 *
 * @param {Object} e
 * @param {Object} callback
 * @author Hector Menendez <etor.mx@gmail.com>
 * @created 2012/AGO/09 14.27
 * @updated 2012/AGO/30 11:33 Moved it to its own module.
 */
Defaults.delEvent = function(e, callback){
    e = String(e);
    if (!Core.isFunction(callback))
        return Core.error('sys:ui:util:defaults:delevent:callback');
    Core.log(e, 'sys:ui:util:defaults:delevent');
    return this.raw.removeEventListener(e, callback);
};


module.exports = Defaults;