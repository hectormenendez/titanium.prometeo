var Type = {};

var Objects = require('sys/core/objects');

/**
 * Default configuration.
 */
var Config = Objects.extend({


}, require('config').Type || {});


/**
 * Checks if given element is indeed a string
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/15 04:53
 */
Type.isString = function(element){
    return typeof element == 'string';
};

/**
 * Checks if given element is indeed an array
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
Type.isArray = function(element){
    return typeof element == 'object' && element instanceof Array;
};

/**
 * Checks if given element is indeed true object (not an array)
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
Type.isObject = function(element){
    return typeof element == 'object' && !Type.isArray(element);
};

/**
 * Checks if given element is indeed true object (not an array)
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
Type.isArgument = function(element){
    return typeof element == 'object' && element.toString() == '[object Arguments]';
};


/**
 * Checks if given element is indeed an function
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
Type.isFunction = function(element){
    return typeof element == 'function';
};

/**
 * Checks if given element is indeed an function
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
Type.isDefined = function(element){
    return typeof element != 'undefined';
};

/**
 * Checks if given element is a Ti.UI element.
 * TODO: Find a better way of doing this.
 *
 * @param {Object} element
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/29 12:26
 */
Type.isTitanium = function(element){
	return (
		Type.isObject(element) && Type.isDefined(element.titaniumElement)
	);
}

Type.isElemental = function(element){
	return (
		Type.isObject(element) && Type.isTitanium(element.raw)
	);
}

module.exports = Type;