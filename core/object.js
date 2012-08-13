
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
 * @created 2011/AGO/01 13:27
 */
exports.count = function(obj){
    var count = 0;
    if (typeof obj != 'object') return count;
    for (var i in obj) if (obj.hasOwnProperty(i)) count++;
    return count;
};
