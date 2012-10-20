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
    { name: 'view'           , method : Ti.UI.createView              },
    { name: 'image'          , method : Ti.UI.createImageView         },
    { name: 'map'            , method : Ti.Map.createView             },
    { name: 'button'         , method : Ti.UI.createButton            },
    { name: 'scrollview'     , method : Ti.UI.createScrollView        },
    { name: 'tableview'      , method : Ti.UI.createTableView         },//TODO
    { name: 'tableviewrow'   , method : Ti.UI.createTableViewRow      },//TODO
    { name: 'buttonfacebook' , method : Ti.Facebook.createLoginButton },//TODO test it
    { name: 'picker'         , method : Ti.UI.createPicker            },
    { name: 'buttonbar'      , method : Ti.UI.createButtonBar         }
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
