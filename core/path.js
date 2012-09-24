
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
 * Since file checking is not behaving normally when compiling javascript for
 * production, I'm relying on try/catches, it sucks, but I need to get the error
 * messages thrown in those cases so I can detect when this happens.
 */
var dump = 'asdfghjkl123456789';
try { require(dump); } catch(e) { Path.notfound = String(e).replace(dump, ''); }


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
