var Core = require('sys/core');
var Style  = require('style');

/**
 * Every element native element will have all these properties
 */
exports.Titanium = {
    add: function(element){
        Core.log(element, 'sys:ui:util:titanium:add');
        element = exports.getTitanium(element);
        return this.raw.add(element);
    },

    del: function(element){
        Core.log(element, 'sys:ui:util:titanium:del');
        element = exports.getTitanium(element);
        return this.raw.remove(element);
    },

    addEvent: function(event, callback){
        event = event.toString();
        if (!Core.isFunction(callback))
            return Core.error('sys:ui:util:titanium:addevent:callback');
        Core.log(event, 'sys:ui:util:titanium:addevent');
        return this.raw.addEventListener(event, callback);
    },

    delEvent: function(event, callback){
        event = event.toString();
        if (!Core.isFunction(callback))
            return Core.error('sys:ui:util:titanium:delevent:callback');
        Core.log(event, 'sys:ui:util:titanium:delevent');
        return this.raw.removeEventListener(event, callback);
    },

    raw : null
};

// Exports elements
exports.declare = function(prop){
    var e = this;
    // make sure the element has a declared style.
    exports.style(e.name);

    if (!Core.isObject(e.extend)) e.extend = {};
    Core.log('Declaring elemental', 'sys:ui:{' + e.name + '}') ;
    this.element = function(properties){
        var element = {};
        // detect classes declared and apply styles.
        properties = exports.classer(e.name, properties);
        // create titanium element and make it availablo for both constructor and element.
        Core.log('Creating Raw element', 'sys:ui:{' + e.name + '}');
        // Obtain raw element
        element.raw = e.raw = e.method(properties);
        // if there's a constructor defined, run it and delete it.
        if (Core.isFunction(e.extend.constructor)) {
            Core.log('Calling constructor', 'sys:ui:{' + e.name + '}');
            e.extend.constructor.call(e, properties);
            delete e.extend.constructor;
        }
        // Define element structure, with both default and extended properties.
        Core.log(properties, 'sys:ui:{' + e.name + '}');
        element = Core.extend(element, exports.Titanium, e.extend);
        return element;
    };
};


/**
 * Obtain the raw titanium element from custom element.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/08 21:27
 */
exports.getTitanium = function(element){
    if (typeof element != 'object') return Core.error('sys:ui:util:titanium:object');
    var found = true;
    for (var i in exports.Titanium) {
        if (typeof element[i] != 'undefined') continue;
        found = false;
        break;
    }
    if (found) return element.raw;
    if (Core.isDefined(element.titaniumName)) return element;
    return Core.error('sys:ui:util:titanium:invalid');
};

/**
 * If an object has a "class" property associate with style.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/08 04:27
 */
exports.classer = function(element, obj){
    if (!Core.isObject(obj)) obj = {};
    if (!Core.isDefined(element))       return Core.error('sys:ui:util:classer:element');
    if (!Core.isObject(Style[element])) return Core.error('sys:ui:util:classer:{' + element + '}');
    element = element.toString();
    // Determine if there's a class to apply, otherwise use master.
    var klass = false;
    if (Core.isDefined(obj['class'])){
        klass = obj['class'].toString();
        delete obj['class'];
        if (klass && !Core.isObject(Style[element][klass]))
            return Core.error('sys:ui:util:classer:{' + element + '.' + klass + '}');
    }
    var target = klass? Style[element][klass] : Style[element];

    Core.log(element + (klass? '.' + klass : ' [no class]') , 'sys:ui:util:classer');
    return Core.extend(target, obj, {
        titaniumName  : element,
        titaniumClass : klass? klass : false
    });
};

exports.style = function(name){
    name = name.toString();
    if (Core.isDefined(Style[name])) {
        Core.log(Style[name], 'style:{' + name + '}');
        return true;
    }
    Core.log('Created style', 'style:{' + name + '}');
    Style[name] = { };
};
