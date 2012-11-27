var Path = {};

/**
 * Module Configuration
 */
var Config = require('sys/core/config')('Path', {});

/**
 * Resources directory full path
 */
Path.resources = Ti.Filesystem.resourcesDirectory;

Path.separator = Ti.Filesystem.separator;

/**
 * Default extension for application files.
 */
Path.extension = '.js';

 
/**
 * Path relative to resources where application files should be stored
 *
 * Note: Do not name this folder 'app', as in Ti v2.2 there's a bug where
 *       an error is thrown if the compiler detects app as name.
 */
Path.bundles = 'bundles/';


/**
 * Locations (order matters) where to look for elementals and compounds
 */
Path.UI = [
    'sys/ui/',
    'lib/'
];

/**
 * Get file resource.
 * 
 * @param {String} path     file location
 * @param {String} context  parent folder 
 */
Path.get = function(path, context){
    context = typeof context == 'undefined'? Path.resources : String(context);
    if (!path) return Ti.Filesystem.getFile(Path.resources);
    path = String(path).split(Ti.Filesystem.separator);
    path.unshift(Path.resources);
    return Ti.Filesystem.getFile.apply(Ti.Filesystem, path);    
}

/**
 * Checks if given file exists, if not, then check if directory exists.
 * The context will be the resources directory.
 */
Path.exists = function(path, context){
    var file = Path.get(path, context);
    return file.exists()? file : false;
};

/**
 * Get Directory listing
 * 
 * @param {String} path     file location
 * @param {String} context  parent folder 
 */
Path.ls = function(path, context){
    var dir = Path.exists(path, context);    
    return (dir && (dir = dir.getDirectoryListing()))? dir : false;
}

/**
 * Read file.
 * 
 * @param {String} path     file location
 * @param {String} context  parent folder 
 */
Path.read = function(path, context){
    var file = Path.exists(path, context);    
    return file? file.read() : false
};

/**
 * Read text on file.
 * @param {String} path
 * @param {String} context
 */
Path.text = function(path, context){
    var file = Path.read(path, context);
    return file? file.text : false;
}

module.exports = Path;
