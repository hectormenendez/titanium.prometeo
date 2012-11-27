var Style = {}

var Path    = require('sys/core/path');
var Type    = require('sys/core/type');
var Objects = require('sys/core/objects');

var Template = {
	elements : {},
	classes  : {}
};

/**
 * Reads style files and creates an extended JSON from them.
 * each argument, must be the relative path to a css file. 
 */
Style.extend = function(){
	var args  = Array.prototype.slice.call(arguments);
	var style = {};
	args.forEach(function(path){
		var tmp = Style.parse(path);
		Objects.each(tmp, function(propName, propValue){
			style[propName] = Objects.extend(style[propName], tmp[propName]);
		});
	});
	return style;
}

/**
 * Reads a CSS file as text, and does a simple parsing on it, 
 * then converts it to a JSON.
 * @param {String} path relative.
 */
Style.parse = function(path){
    
    path = path? String(path) : 'style.css';
    
    var error = function(body, title){
        throw  "sys:core:style:" + title + "\n"  + String(body).replace(/\s+/g, ' ').trim() + "\n";
    };
    
    var style = Path.text(path);
    
    if (!style) return Template;
    
    // Declaration
    var rxD  = /(?:[^\{]+)\s*\{\s*(?:[^}]+)\s*\}/g;
    // Target
    var rxT  = /^([^{]+){/;
	// Target Properties 	
    var rxTP = /^([a-z][\w-]+)?\s*((?:\.[a-z][\w-]+\s*)+)?/i;
	// Space
    var rxS  = /\s+/g;
    // Quotes
    var rxQ  = /[\"\']/g;
    // Quotes and Space
    var rxQS = /[\"\'\s]/g;
    // Properties
    var rxP  = /^(?:[^\{]+\{)\s*([^\}]+)\s*[^\}]\}/m;

    var match, target, parts, prop, elem, clas, props;
    while (((match = rxD.exec(style)) != null) && (match = match[0].trim())){
        // extract target
        if (!(target = rxT.exec(match)) || !(target = target[1].trim()))
            return error(match,'target');
        // extract target parts
        if (!(parts = rxTP.exec(target)))
            return error(match,'target:parts');
        // extract properties
        if (!(prop = rxP.exec(match)) || !(prop = prop[1].trim().split(';')))
            return error(match, 'prop');
        // split properties
        if (prop.pop())
            return error(match, 'prop:semicolon');
        if (!prop.length)
            return error(match, 'prop:empty');
        props = {};
        prop.forEach(function(p){
            p = p.split(':');
            if (p.length != 2)
                return error(match, 'prop:format');
            p[0] = p[0].replace(rxQS, '');
            p[1] = p[1].match(rxQ)? p[1].replace(rxQ, '').trim() : p[1].trim();
            props[p[0]] = p[1];
        });
        // split definition
        elem = parts[1]? parts[1] : null;
        clas = parts[2]? parts[2].replace(rxS,'').split('.') : [];
        if (clas.length) clas.shift();
        // fill elements object
		if (elem && !clas.length){
			if (!Type.isDefined(Template.elements[elem])){
				Template.elements[elem] = props;
				Template.elements[elem].classes = {};
			}
			else Template.elements[elem] = Objects.extend(Template.elements[elem],props);
		}
		else if (elem && clas.length){
			if (!Type.isDefined(Template.elements[elem]))
				Template.elements[elem] = { classes : {} };
        	clas.forEach(function(className){
        		Template.elements[elem].classes[className] = props;
        	});
        }
        else if (!elem && clas.length) clas.forEach(function(className){
        	Template.classes[className] = props;
        });
	}
	// Now that we have our element populated, we must traverse every property
	// in order to replace coincident classes.
	var classer = function(subject){
		Objects.each(subject, function(subjectName, subjectProps){
			Objects.each(subjectProps, function(propName, propValue){
				if (!Type.isString(propValue) || propValue.charAt(0) !== '@')
					return;
				var val = propValue.substr(1);
				if (!Type.isObject(Template.classes[val])){
					var tmp = {};
					tmp[subjectName] = {};
					tmp[subjectName][propName] = propValue;
					return error(JSON.stringify(tmp), 'classer:notfound');
				}
				subject[subjectName][propName] = Template.classes[val];	
			})
		});		
	}
	// start with classes themselves.
	classer(Template.classes);
	// now with element specific classes
	Objects.each(Template.elements, function(elemName, elemProps){
		classer(elemProps.classes);
	});
	// now with elements
	classer(Template.elements);
	
	return Template;
};

module.exports = Style;