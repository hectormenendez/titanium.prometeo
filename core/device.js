
var Device = {};

Device.isApple     = false;
Device.isAndroid   = false;
Device.isTablet    = false;
Device.isSupported = true;

Device.name        = Ti.Platform.osname;
Device.version     = parseFloat(Ti.Platform.version);
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

/**
 * Converts pixels to DP units. (On older iOS devices 1px = 1dp)
 *
 * @param {number} The pixels to convert.
 * @author Hector Menendez <etor.mx@gmail.com>
 * @created 2012/AGO/30 08:45
 */
Device.px2dp = function(px){
	px = parseInt(px, 10);
	px = Ti.Platform.displayCaps.dpi > 160?
		px / (Ti.Platform.displayCaps.dpi / 160) : px;
	if (Device.isApple && Ti.Platform.displayCaps.dpi > 160) px = px*2;
	return px;
}

/**
 * Converts DP units to pixels. (On older iOS devices 1dp = 1px)
 *
 * @param {number} The DPs to convert.
 * @author Hector Menendez <etor.mx@gmail.com>
 * @created 2012/AGO/30 08:47
 */
Device.dp2px = function(dp){
	dp = parseInt(dp, 10);
	return Ti.Platform.displayCaps.dpi > 160?
		dp * (Ti.Platform.displayCaps.dpi / 160) : dp;
}

module.exports = Device;