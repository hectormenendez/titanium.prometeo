/**
 * Common Methods for Elementals and Compounds
 */
var Util = {};

var Core    = require('sys/core');
var Type    = require('sys/core/type');
var Path    = require('sys/core/path');
var Objects = require('sys/core/objects'); 

/**
 * Loads UI controllers from UI paths, load templates and separate constructors.
 * @param {String} type
 * @param {Function} callback
 */
Util.load = function(type, callback){

    if (type != 'elemental' && type != 'compound')
        return Core.error('sys:ui:util:load:type'); 

    // Load template file and remove commonJS properties.
    var Template = require('sys/ui/template/' + type);
    if (Type.isDefined(Template.uri)) delete Template.uri;
    if (Type.isDefined(Template.id))  delete Template.id;
    
    var Loaded = {};
    
    // Iterate UI paths
    Path.UI.forEach(function(path){
        var ls;
        path = path + type + 's';
        // Iterate files on path
        if (!(ls = Path.ls(path))) return;
        ls.forEach(function(file){
            var target;
            var name = file.replace(Path.extension, '').toLowerCase();
            file = path + Path.separator  + name;
            Core.log(name, 'sys:ui:util:load:{' + type + '}:declare');
            var elem = require(file);
            elem = Objects.clone(elem);
            // Android doesn't set the id property correctly; set it manually.
            elem.id  = file;
            // This property is useles
            if (elem.uri) delete elem.uri;
            // make sure a constructor exists
            if (!Type.isDefined(elem.construct))
                return Core.error(name, 'sys:ui:util:load:{' + type + '}:construct');
            var construct = elem.construct;
            delete elem.construct;
            // get the target element
            if (type == 'elemental'){
                // make sure a raw element exist
                if (!Type.isDefined(elem.raw))
                    return Core.error(name, 'sys:ui:util:load:{' + type + '}:raw');
                target = elem.raw;
                delete elem.raw;                
            }
            else if (type == 'compound'){
                // make sure a $element exist
                if (!Type.isDefined(elem.$element))
                    return Core.error(name, 'sys:ui:util:load:{' + type + '}:$element');
                target = elem.$element;
                delete elem.$element;
            }
            // send element to build custom constructor
            Loaded[name] = callback({
                name       : name,
                file       : file,
                construct  : construct,
                target     : target,
                properties : elem,
                template   : Template
            });
        });
    });
    return Loaded;
}

/**
 * 
 * @param {Object} className
 */
Util.classer = function(o){
	
	var Style = require(o.path);

	if (!Type.isDefined(o.prop.className)) return o.prop;
	
	if (Type.isString(o.prop.className))
		o.prop.className = [o.prop.className];
	else if (!Type.isArray(o.prop.className))
		return Core.error(o.prop, 'sys:ui:util:classer:classname');
	var result = {};
	o.prop.className.forEach(function(className){
		// Specific class for element
		if (
			Type.isDefined(Style.elements[o.name])
		&&
			Type.isDefined(Style.elements[o.name].classes[className])
		)	return result = Objects.extend(
				result,
				Style.elements[o.name].classes[className]
			);
		// general classes
		if (Type.isDefined(Style.classes[className]))
			return result = Objects.extend(
				result,
				Style.classes[className]
			);
		// not found
		Core.error(
			o.name + ':' + className, 'sys:ui:util:classer:classname:notfound'
		);
	});
	o.props = Objects.extend(o.props, result);
	delete o.props.className;
	return o.props;	
}

module.exports = Util;