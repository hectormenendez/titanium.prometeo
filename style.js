/**
 *     _____ __        __
 *    / ___// /___  __/ /__
 *    \__ \/ __/ / / / / _ \
 *   ___/ / /_/ /_/ / /  __/
 *  /____/\__/\__, /_/\___/
 *           /____/
 * {file} Style utilities.
 *
 * @created 2012/AGO/15 02:40 Héctor Menéndez <etor.mx@gmail.com>
 */
var Style = {};

var Core = require('sys/core');

/**
 * @created 2012/AGO/15 04:26 Héctor Menéndez <etor.mx@gmail.com>
 */
Style.add = function(properties){
    if (!Core.isObject(properties)) return Core.error('sys:style:add:properties');
    var element = function(){};
    element.prototype = properties;
    // This element will hold the classes
    element.prototype.$class = {};
    // Define the classer method
    element.prototype['class'] = function(name, properties){
        if (!Core.isString(name) || !Core.isObject(properties))
            return Core.error('sys:style:add:class:arguments');
        // specified class, must not previously exist.
        if (Core.isDefined(this.$class[name]))
            return Core.error('sys:style:add:class:exists');
        // copy properties.
        var copy = {};
        for(var i in this) if (i != 'class' &&  i != '$class') copy[i] = this[i];
        properties = Core.extend(copy, properties);
        this.$class[name] = properties;
    };
    return new element();
};

/**
 * @created 2012/AGO/15 05:42 Héctor Menéndez <etor.mx@gmail.com>
 */
Style.clean = function(style){
    for (var i in style){
        var $class = style[i]['$class'];
        style[i]['class']  = undefined;
        style[i]['$class'] = undefined;
        var $raw   = {};
        for (var j in style[i]) $raw[j] = style[i][j];
        style[i] = { raw: $raw, 'class':$class };
    }
    return style;
};

module.exports = Style;
