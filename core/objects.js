var Objects = {}

/**
 * Extend object with N number of arguments (also objects)
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/01 10:34
 */
Objects.extend = function(){
    var obj = {};
    Array.prototype.slice.call(arguments).forEach(function(elem){
        if (typeof elem != 'object') return;
        for (var propName in elem){
            if (!elem.hasOwnProperty(propName)) continue;
            obj[propName] = elem[propName];
        }
    });
    return obj;
};


/**
 * Default configuration.
 */
var Config = Objects.extend({

	maxStringify : 5

}, require('config').Objects || {});

/**
 * Copy an object
 */
Objects.copy = function(obj){
    if (typeof obj != 'object' || !obj instanceof Object) return false;
    var result = {};
    for(var i in obj) if (obj.hasOwnProperty(i)) result[i] = obj[i];
    return result;
};

/**
 * Correctly Iterates an object.
 * If the function returns null, the iteration will break;
 *
 * @usage    Core.each({a:'A',b:'B'}, function(key, val){ this === obj })
 * @author   Hector Menendez <etor.mx@gmail.com>
 * @created  2012/AGO/08 02:16
 */
Objects.each = function(obj, callback){
    if (typeof obj      != 'object') obj = {};
    if (typeof callback != 'function') callback = function(){};
    for (var i in obj)
        if (obj.hasOwnProperty(i) && callback.call(obj, i, obj[i]) === null)
            break;
};

/**
 * Count elements in object
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/01 13:27
 */
Objects.count = function(obj){
    var count = 0;
    if (typeof obj != 'object') return count;
    for (var i in obj) if (obj.hasOwnProperty(i)) count++;
    return count;
};

/**
 * Stringify an object without losing elements containing callbacks.
 *
 * @param {mixed} obj
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/15 10:27
 * @updated 2012/AGO/29 16:34 Completely rewritten, now it doesn't depend on
 *                            JSON's stringify anymore.
 */
Objects.stringify = function(obj, count){

	var isMultiple = function(o){
		var isArray  = (o && o instanceof Array);
		var isObject = (o && !isArray && typeof o == 'object');
		return {
			'isArray'  : isArray,
			'isObject' : isObject
		}
	}
	count = typeof count == 'number'? (count + 1) : 0;
	// everything that's not an object will be converted to string.
	var oMain = isMultiple(obj);

	if (count > Config.maxStringify || (!oMain.isArray && !oMain.isObject))
		return '"' + obj.toString() + '"';
	// okay then, this is either an object or an array
	var value, oSub, key;
	var json = oMain.isArray? '[' : '{';
	for (key in obj){
		// Titanium has some issues with undefined properties, prevent it.
		try { value = obj[key]; } catch (e){ value = '## ERROR ##'; }
		oSub = isMultiple(value);
		// be recursive if necessary
		if (oSub.isArray || oSub.isObject)
			value = '"' + key + '":' + Objects.stringify(value) + ',';
		else {
			// Skip all those elements whose value is not set
			if (value === undefined) continue;
			value = typeof value == 'function'? 'function()…' : String(value);
			     if (oMain.isArray)  value = '"' + value + '",';
			else if (oMain.isObject) value = '"' + key + '":"' + value + '",';
		}
		// not an object
		json += value;
	}
	json = (oMain.isArray? json + ']' : json.slice(0,-1) + '}');
	return json;
};

module.exports = Objects;