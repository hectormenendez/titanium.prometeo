/**
 * Make every UI Elemental available.
 * 
 * LIB elementals overwrite SYS elementals.
 */

var Core    = require('sys/core');
var Objects = require('sys/core/objects');
var Type    = require('sys/core/type');
var Util    = require('sys/ui/util'); 

module.exports = Util.load('elemental', function(elem){
	
	elem.construct.prototype = Objects.extend(elem.template, elem.properties);
	
    return function(props){
    	if (!Type.isObject(props)) props = {};
    	else props = Objects.clone(props);
    	// get classes if available;
		props = Util.classer({
			name : elem.name,
			prop : props,
			path : 'sys/style/lib'
		});    	
    	elem.construct.prototype.raw = elem.target(props);
    	// instantiate elemental
    	var Element = elem.construct;
    	Element = new Element();
    	// a user must allways be allowed to recover elemental
    	Element.raw.$self = function(){ return Element; }
    	return Element;
    }
});
