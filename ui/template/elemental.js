/**
 * Elemental Declaration
 * All elementals will have these properties and methods declared by default
 */
var Elemental = {};

Elemental.add = function(){
	alert(this);
};

Elemental.del = function(){};

Elemental.addEvent = function(){};

Elemental.delEvent = function(){};

module.exports = Elemental;