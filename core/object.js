exports.copy = function(obj){
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
exports.each = function(obj, callback){
    if (typeof obj      != 'object') obj = {};
    if (typeof callback != 'function') callback = function(){};
    for (var i in obj)
        if (obj.hasOwnProperty(i) && callback.call(obj, i, obj[i]) === null)
            break;
};

/**
 * Extend object with N number of arguments (also objects)
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/01 10:34
 */
exports.extend = function(){
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
 * Count elements in object
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/01 13:27
 */
exports.count = function(obj){
    var count = 0;
    if (typeof obj != 'object') return count;
    for (var i in obj) if (obj.hasOwnProperty(i)) count++;
    return count;
};

/**
 * Stringify an object without losing elements containing callbacks.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/15 10:27
 * @updated 2012/AGO/29 02:22 Using switch, instead of ternary.
 */
exports.stringify = function(obj){
	var log = {};
	for (var l in obj) {
		switch (typeof obj[l]){
			case 'function' : log[l] = 'callback'; break;
			case   'object' : log[l] = JSON.stringify(obj[l]).replace(/\"/g,"'"); break;
			default         : log[l] = obj[l];
		}
	}
	return JSON.stringify(log);
};
