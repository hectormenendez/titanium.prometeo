
var Path = {};

/**
 * Resources directory full path
 */
Path.resources = Ti.Filesystem.getResourcesDirectory();

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
Path.app = 'bundles/';


/**
 * Checks if given file exists, if not, then check if directory exists.
 * The context will be the resources directory.
 */
Path.exists = function(path){
    var i, b;
    //path = [Path.resources + path + Path.extension, Path.resources+path];
    //for (i in path){
        var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, path.toString() + '.js');
		return file.exists();

        if (b) return true;
    //}
    return false;
};


Path.read = function(path){
    //if (!Path.exists(path)) return false;
    var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, path + Path.extension);
    var blob = file.read();
    return blob.text;
};

module.exports = Path;
