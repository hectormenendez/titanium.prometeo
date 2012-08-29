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
            }
        }
    },
    { name: 'view'           , method : Ti.UI.createView              },
    { name: 'image'          , method : Ti.UI.createImageView         },
    { name: 'map'            , method : Ti.Map.createView             },
    { name: 'button'         , method : Ti.UI.createButton            },
    { name: 'label'          , method : Ti.UI.createLabel             },
    { name: 'scrollview'     , method : Ti.UI.createScrollView        },
    { name: 'tableview'      , method : Ti.UI.createTableView         },//TODO
    { name: 'textfield'      , method : Ti.UI.createTextField         },
    { name: 'tableviewrow'   , method : Ti.UI.createTableViewRow      },//TODO
    { name: 'buttonfacebook' , method : Ti.Facebook.createLoginButton },//TODO test it
    { name: 'picker'         , method : Ti.UI.createPicker            }
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
