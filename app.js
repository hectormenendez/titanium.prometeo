
/**
 * Application loader
 * {method} Loads a file from the application folder as if it was a module and
 *          runs a custom constructor
 *
 * @param   {array}*    An array of arguments to be sent to the constructor,
 *                      The first one must be a string, with the app name.
 *
 * @created 2011/NOV/21 14:33 Héctor Menéndez <etor.mx@gmail.com>
 * @updated 2012/SEP/05 13:47 Héctor Menéndez <etor.mx@gmail.com>
 *                            Module replication was not being set correclty.
 */
Core.load = function(name, args){
    if (!Type.isString(name)) return Core.error('sys:core:load:name');
    if (!Type.isArray(args)) args = [];
    // this private method will convert a commonJS module to a instance.
    var mod2ins = function(module, args, name){
        if (!Type.isObject(module))
            return Core.error(name, 'sys:core:load:mod2ins:type');
        // pseudo instance
        var instance = function(){
            Core.log(args, 'sys:core:load:mod2ins:{' + name + '}');
            if (Type.isDefined(this.__construct)) {
                Core.log(name, 'sys:core:load:mod2ins:masterconstruct');
                this.__construct.apply(this, args);
                this.__construct = undefined;
            }
            return this.construct.apply(this, args);
        }
        // verify a constructor is defined
        if (!Type.isFunction(module.construct))
            return Core.error(name, 'sys:core:load:mod2ins:construct');
        var i, path = 'lib/' + Path.bundles + name, master = false;
        //
        var extend = function(e){
            for (i in e) if (e.hasOwnProperty(i)) instance.prototype[i] = e[i];
        }
        // but wait, does a master file exist? if so, extend it.
        try {
            master = require(path);
        } catch(e) {
            if (Path.notfound + path == String(e))
                Core.log(name, 'sys:core:load:mod2ins:master:notfound');
            else throw path + ': ' + String(e);
        };
        if (master) extend(master);
        // convert module properties to instance properties.
        extend(module);
        return instance;
    }
    // Have to do this with try catches since Titanium is not consistent
    // with filesystem methods. (specially those with JS involved)
    var MVC = {
        file    : false,
        model   : false,
        view    : false,
        control : false
    };
    var path = Path.bundles + name;
    var i,p;
    for (i in MVC){
         p = (i == 'file')? path : path + '/' + i;

         try {
            MVC[i] = require(p);
         } catch (e){
            // if module not found, just log it, but if an error is found, throw it.
            if (Path.notfound + p == String(e))
                Core.log(name, 'sys:core:load:notfound:{' + i + '}');
            else throw p + ': ' + String(e);
         }
         if (MVC[i]){
            if (Type.isDefined(MVC[i].uri)) MVC[i].uri = undefined;
            if (!Type.isDefined(MVC[i].id)) MVC[i].id  = p;
            MVC[i] = mod2ins(MVC[i], args, i);
         }
    }
    return MVC;
};