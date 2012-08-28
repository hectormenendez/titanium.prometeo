
/**
 * Resources directory full path
 */
exports.resources = Ti.Filesystem.getResourcesDirectory();

/**
 * Default extension for application files.
 */
exports.extension = '.js';

/**
 * Path relative to resources where application files should be stored
 *
 * Note: Do not name this folder 'app', as in Ti v2.2 there's a bug where
 *       an error is thrown if the compiler detects app as name.
 */
exports.app = 'application/';


/**
 * Checks if given file exists, if not, then check if directory exists.
 * The context will be the resources directory.
 */
exports.exists = function(path){
    var i, b;
    //path = [exports.resources + path + exports.extension, exports.resources+path];
    //for (i in path){
        var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, path.toString() + '.js');
		return file.exists();

        if (b) return true;
    //}
    return false;
};


exports.read = function(path){
    //if (!exports.exists(path)) return false;
    var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, path + exports.extension);
    var blob = file.read();
    return blob.text;
};
