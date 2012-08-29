var Core  = require('sys/core');
var Style = require('style');

/**
 * Every element native element will have all these properties
 */
exports.Titanium = {
    add: function(element, properties){
        Core.log(element, 'sys:ui:util:titanium:add');
		// if an element is being sent, just add it with no auto variable.
        if (Core.isObject(element)){
	        element = exports.getTitanium(element);
	        return this.raw.add(element);
        }
        // but if a string was sent, then the user wants us
        // to create an auto element.
		if (!Core.isString(element))
			return Core.error(element, 'sys:ui:util:titanium:add:element');
		// the auto creation is limited to elementals.
		if (!Core.isDefined(exports.declared[element]))
			return Core.error(element, 'sys:ui:util:titanium:add:defined');
		if (!Core.isObject(properties)) properties = {};
		// all ok, create and add element.
		var UI = require('sys/ui');
		this['$' + element] = UI[element](properties);
		this.add(this['$' + element]);
		return this['$' + element];
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

exports.declared = {};

// Exports elements
exports.declare = function(prop){
    var self = this;
    // make sure the element has a declared style.
    exports.style(self.name);
    if (!Core.isObject(self.extend)) self.extend = {};
    Core.log('Declaring elemental', 'sys:ui:{' + self.name + '}') ;
    exports.declared[self.name] = true;
    this.element = function(properties){
        var element = {};
        // detect classes declared and apply styles.
        properties = exports.classer(self.name, properties);
        // create titanium element and make it available for both constructor and element.
        Core.log('Creating Raw element ' + Core.stringify(properties), 'sys:ui:{' + self.name + '}');
        element.raw = self.raw = self.method(properties);
        // if there's a constructor defined, run it and delete it.
        if (Core.isFunction(self.extend.construct)) {
            Core.log('Calling constructor', 'sys:ui:{' + self.name + '}');
            self.extend.construct.call(self, properties);
            self.extend.construct = undefined;
        }
        // Define element structure, with both default and extended properties.
        element = Core.extend(exports.Titanium, self.extend, element);
        Core.log('Returning UI element ' + Core.stringify(element), 'sys:ui:{' + self.name + '}');
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
        if (Core.isDefined(element[i])) continue;
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

exports.style = function(name){
    name = name.toString();
    if (Core.isObject(Style[name]) && Core.isObject(Style[name].raw)) {
        Core.log(Style[name].raw, 'style:{' + name + '}');
        return true;
    }
    Core.log('Created style', 'style:{' + name + '}');
    Style[name] = { raw:{}, 'class':{} };
};
