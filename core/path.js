
var Path = {};

/**
 * Resources directory full path
 */
Path.resources = Ti.Filesystem.resourcesDirectory;

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

Path.get = function(path){
    return Ti.Filesystem.getFile(Path.resources, String(path));
};

/**
 * Checks if given file exists, if not, then check if directory exists.
 * The context will be the resources directory.
 */
Path.exists = function(path){
    var file = Path.get(path);
    return file.exists()? file : false;
};


Path.read = function(path){
    var file = Path.exists(path);
    if (!file) return null;
    return file.read();
};

Path.text = function(path){
    var blob = Path.read(path);
    if (!blob) return null;
    return blob.text;
};

module.exports = Path;
