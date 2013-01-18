/**
 * Low level UI controllers.
 *
 * These are just wrappers for Titanium Available controls.
 */
var Core   = require('sys/core');
var Util   = require('sys/ui/util');

var element;

// Generic element
element = [
    {
        name   : 'window',
        method : Ti.UI.createWindow,
        extend : {
            open:function(){
                Core.log(element, 'sys:ui:window:open');
                return this.raw.open();
            },
            close:function(){
                Core.log(element, 'sys:ui:window:close');
                return this.raw.close();
            },
            queue:{
                stack: {
                    open  : [],
                    close : []
                },
                open:function(callback){
                    if (!Core.isArray(this.stack.open)) this.stack.open = [];
                    if (!Core.isFunction(callback))
                        return Core.error('sys:ui:window:queue:type');
                    this.stack.open.push(callback);
                }
            }
        }
    },
    {
        name   : 'textfield',
        method : Ti.UI.createTextField,
        extend : {
            value : function(){
                return this.raw.value;
            }
        }
    },
    {
        name   : 'label',
        method : Ti.UI.createLabel,
        extend : {
            text : function(){
                return this.raw.text;
            }
        }
    },
    {
	name	: 'switch',
	method	: Ti.UI.createSwitch,
	extend	: {
		value : function(){
			return this.raw.value;
		}
	}
    },
    {
	name: 'check',
	method : Ti.UI.createPicker,
	extend : {
		selected : function(column, row){
			return this.raw.setSelectedRow(column, row, false);
		}
	}
    },
    { name: 'view'           , method : Ti.UI.createView              },
    { name: 'image'          , method : Ti.UI.createImageView         },
    { name: 'map'            , method : Ti.Map.createView             },
    { name: 'button'         , method : Ti.UI.createButton            },
    { name: 'scrollview'     , method : Ti.UI.createScrollView        },
    { name: 'tableview'      , method : Ti.UI.createTableView         },
    { name: 'tableviewrow'   , method : Ti.UI.createTableViewRow      },
    { name: 'buttonfacebook' , method : Ti.Facebook.createLoginButton },
    { name: 'buttonbar'      , method : Ti.UI.createButtonBar         },
    { name: 'dialog'   		 , method : Ti.UI.createAlertDialog		  },
    { name: 'optionaldialog' , method : Ti.UI.createOptionDialog	  },
    { name: 'pickercolum'	 , method :	Ti.UI.createPickerColumn	  },
    { name: 'pickerrow'  	 , method : Ti.UI.createPickerRow		  }
];

// Apple specific element
if (Core.Device.isApple) element = element.concat([

    { name: 'navigation', method:Ti.UI.iPhone.createNavigationGroup }

]);

// Android specific element
else element = element.concat([

    // Android here

]);



// make all elements available
for (var i in element){
    Util.declare.prototype   = element[i];
    exports[element[i].name] = new Util.declare().element;
}
