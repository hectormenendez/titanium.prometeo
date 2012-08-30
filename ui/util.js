var Core     = require('sys/core');
var Style    = require('style');
var Defaults = require('sys/ui/defaults');

var Util = {};

/**
 * Every element native element will have all these properties
 */
Util.Defaults = Defaults;

/**
 * Declares Elementals
 * TODO: Write documentation.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/08 20:25
 */
Util.declare = function(prop){
    var self = this;
    // make sure the element has a declared style.
    Util.style(self.name);
    if (!Core.isObject(self.extend)) self.extend = {};
    Core.log('Declaring elemental', 'sys:ui:{' + self.name + '}') ;
    this.element = function(properties){
        var element = {};
        // detect classes declared and apply styles.
        properties = Util.classer(self.name, properties);
        // create titanium element and make it available for both constructor and element.
        // Core.log('Creating Raw element ' + Core.stringify(properties), 'sys:ui:{' + self.name + '}');
        element.raw = self.raw = self.method(properties);
        // if there's a constructor defined, run it and delete it.
        if (Core.isFunction(self.extend.construct)) {
            Core.log('Calling constructor', 'sys:ui:{' + self.name + '}');
            self.extend.construct.call(self, properties);
            self.extend.construct = undefined;
        }
        // Define element structure, with both default and extended properties.
        element = Core.extend(Util.Defaults, self.extend, element);
        // Core.log('Returning UI element ' + Core.stringify(element), 'sys:ui:{' + self.name + '}');
        return element;
    };
};

/**
 * If an object has a "class" property associate with style.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/08 04:27
 */
Util.classer = function(element, obj){
    if (!Core.isObject(obj)) obj = {};
    if (!Core.isDefined(element))
        return Core.error('sys:ui:util:classer:element');

    element = element.toString();

    if (!Core.isObject(Style[element]) || !Core.isObject(Style[element]['raw']))
        return Core.error('sys:ui:util:classer:{' + element + '}');
    // Determine if there's a class to apply, otherwise use master.
    var klass = false;
    if (Core.isDefined(obj['class'])){
        klass = obj['class'].toString();
        obj['class'] = undefined;
        if (klass && (
            !Core.isObject(Style[element]['class']) ||
            !Core.isObject(Style[element]['class'][klass])
        ))
            return Core.error('sys:ui:util:classer:{' + element + '.' + klass + '}');
    }
    var target = klass? Style[element]['class'][klass] : Style[element]['raw'];

    Core.log(element + (klass? '.' + klass : ' [no class]') , 'sys:ui:util:classer');
    return Core.extend(target, obj, {
        titaniumName  : element,
        titaniumClass : klass? klass : false
    });
};

/**
 * Checks if style exists, if not, creates one to avoid errors.
 *
 * @param {String} name
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AGO/08 05:12
 */
Util.style = function(name){
    name = name.toString();
    if (Core.isObject(Style[name]) && Core.isObject(Style[name].raw)) {
        Core.log(Style[name].raw, 'style:{' + name + '}');
        return true;
    }
    Core.log('Created style', 'style:{' + name + '}');
    Style[name] = { raw:{}, 'class':{} };
};

module.exports = Util;