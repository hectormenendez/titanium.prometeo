
var Device = {};

Device.isApple     = false;
Device.isAndroid   = false;
Device.isTablet    = false;
Device.isSupported = true;

Device.name        = Ti.Platform.osname;
Device.version     = Ti.Platform.version;
Device.height      = Ti.Platform.displayCaps.platformHeight;
Device.width       = Ti.Platform.displayCaps.platformWidth;

switch (Device.name) {
    case 'ipad'   :
    case 'iphone' :
        Device.isApple  = true;
        break;
    case 'android':
        Device.isAndroid = true;
        break;
    default:
        Device.isSupported = false;
}

if (Device.name == 'ipad' || Device.height > 899 || Device.width > 899)
    Device.isTablet = true;

module.exports = Device;