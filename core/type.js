/**
 * Checks if given element is indeed a string
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/15 04:53
 */
exports.isString = function(element){
    return typeof element == 'string';
};

/**
 * Checks if given element is indeed an array
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
exports.isArray = function(element){
    return typeof element == 'object' && element instanceof Array;
};

/**
 * Checks if given element is indeed true object (not an array)
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
exports.isObject = function(element){
    return typeof element == 'object' && element.toString() == '[object Object]';
};

/**
 * Checks if given element is indeed true object (not an array)
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
exports.isArgument = function(element){
    return typeof element == 'object' && element.toString() == '[object Arguments]';
};


/**
 * Checks if given element is indeed an function
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
exports.isFunction = function(element){
    return typeof element == 'function';
};

/**
 * Checks if given element is indeed an function
 *
 * @author  Héctor Menéndez
 * @created 2012/AGO/8 03:15
 */
exports.isDefined = function(element){
    return typeof element != 'undefined';
};
