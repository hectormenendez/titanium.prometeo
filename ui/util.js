var Core     = require('sys/core');
var Device   = require('sys/core/device');
var Type     = require('sys/core/type');
var Objects  = require('sys/core/objects');
var Path     = require('sys/core/path');

var Defaults = require('sys/ui/defaults');
var Style    = require('style');

var Util = {};

/**
 * Every element native element will have all these properties
 */
Util.Defaults = Defaults;

var compound = {};

Util.compound = function(name){
	Core.log(name, 'lib:ui:util:compound:declare');
	name = String(name);
	// If we havent imported the module, do it so.
	if (!Type.isDefined(compound[name])){
		var path   = 'lib/ui/' + name;
		try { compound[name] = require(path); } catch (e) {
			if (e == Path.notfound + path)
				return Core.error(e, 'sys:ui:util:compound:{' + name + '}');
			throw String(e);
		}
		if (!Type.isDefined(compound[name].construct))
			return Core.error(name, 'sys:ui:util:compound:construct');
		if (!Type.isDefined(compound[name].$element))
			return Core.error(name, 'sys:ui:util:compound:$element');
	}
	// copy the module and treat it as instance.
	var fn = compound[name].construct;
	// Android is not assigning an id (for whatever reason)
	if (Device.isAndroid) compound[name].id = path;
	for (var i in compound[name])
		if (compound[name].hasOwnProperty(i) && i != 'construct' && i != 'uri')
			fn.prototype[i] = compound[name][i];
	// return the container element, and make sure original instance is
	// still available to the compound developer.
	return function(){
		Core.log(name, 'lib:ui:util:compound:instance');
		// we need to pass arguments to compound constructor
		var args = Core.args(arguments);
		var instance = function(){
			return fn.apply(this, args);
		}
		instance.prototype = fn.prototype;
		instance = new instance();
		instance.$element.instance = function(){
			return instance;
		}
		return instance.$element;
	}
};

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
    if (!Type.isObject(self.extend)) self.extend = {};
    Core.log('Declaring elemental', 'sys:ui:{' + self.name + '}') ;
    this.element = function(properties){
        var element = {};
        // detect classes declared and apply styles.
        properties = Util.classer(self.name, properties);
        // create titanium element and make it available for both constructor and element.
        // Core.log('Creating Raw element ' + Objects.stringify(properties), 'sys:ui:{' + self.name + '}');
        element.raw = self.raw = self.method(properties);
        // if there's a constructor defined, run it and delete it.
        if (Type.isFunction(self.extend.construct)) {
            Core.log('Calling constructor', 'sys:ui:{' + self.name + '}');
            self.extend.construct.call(self, properties);
            self.extend.construct = undefined;
        }
        // Define element structure, with both default and extended properties.
        element = Objects.extend(Util.Defaults, self.extend, element);
        // Core.log('Returning UI element ' + Objects.stringify(element), 'sys:ui:{' + self.name + '}');
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
    if (!Type.isObject(obj)) obj = {};
    if (!Type.isDefined(element))
        return Core.error('sys:ui:util:classer:element');

    element = element.toString();

    if (!Type.isObject(Style[element]) || !Type.isObject(Style[element]['raw']))
        return Core.error('sys:ui:util:classer:{' + element + '}');
    // Determine if there's a class to apply, otherwise use master.
    var klass = false;
    if (Type.isDefined(obj['class'])){
        klass = obj['class'].toString();
        obj['class'] = undefined;
        if (klass && (
            !Type.isObject(Style[element]['class']) ||
            !Type.isObject(Style[element]['class'][klass])
        ))
            return Core.error('sys:ui:util:classer:{' + element + '.' + klass + '}');
    }
    var target = klass? Style[element]['class'][klass] : Style[element]['raw'];

    Core.log(element + (klass? '.' + klass : ' [no class]') , 'sys:ui:util:classer');
    return Objects.extend(target, obj, {
        titaniumElement : element,
        titaniumClass   : klass? klass : false
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
    if (Type.isObject(Style[name]) && Type.isObject(Style[name].raw)) {
        Core.log(Style[name].raw, 'style:{' + name + '}');
        return true;
    }
    Core.log('Created style', 'style:{' + name + '}');
    Style[name] = { raw:{}, 'class':{} };
};

module.exports = Util;