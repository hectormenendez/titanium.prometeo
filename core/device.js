
exports.isApple     = false;
exports.isAndroid   = false;
exports.isTablet    = false;
exports.isSupported = true;

exports.name        = Ti.Platform.osname;
exports.version     = Ti.Platform.version;
exports.height      = Ti.Platform.displayCaps.platformHeight;
exports.width       = Ti.Platform.displayCaps.platformWidth;

switch (exports.name) {
    case 'ipad'   :
    case 'iphone' :
        exports.isApple  = true;
        break;
    case 'android':
        exports.isAndroid = true;
        break;
    default:
        exports.isSupported = false;
}

if (exports.name == 'ipad' || exports.height > 899 || exports.width > 899)
    exports.isTablet = true;
