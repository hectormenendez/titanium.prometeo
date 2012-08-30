var Geo = {};

/**
 * Maximun zoom levels allowed by google.
 */
Geo.zoomax = 20;

/**
 * Maximum number of pixels for maps. (based upon 256x256 tiles)
 */
Geo.pixels = 536870912;

/**
 * Converts Pixel XY to Latitude, Longitude.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AUG/01 02:23
 */
Geo.toCoord = function(geo){
    if (
        typeof geo      != 'object' ||
        typeof geo.x    != 'number' ||
        typeof geo.y    != 'number'
    )
        return false;

    var offset  = Geo.pixels / 2.0;
    var radius  = offset / Math.PI;

    geo.latitude  = (
        (Math.PI / 2.0) - 2.0 * Math.atan(
            Math.exp((Math.round(geo.y) - offset) / radius)
        )
    ) * 180.0 / Math.PI;
    geo.longitude = ((Math.round(geo.x) - offset) / radius) * 180.0 / Math.PI;

    return geo;
};

/**
 * Converts Latitude,Longitude to Pixel XY.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AUG/01 02:32
 */
Geo.toPixel = function(geo){
    if (
        typeof geo           != 'object' ||
        typeof geo.latitude  != 'number' ||
        typeof geo.longitude != 'number'
    )
        return false;

    // obtain the offset for the zoom level
    var offset = Geo.pixels / 2.0;
    var radius = offset / Math.PI;

    geo.x = Math.round(
        offset + radius * geo.longitude * Math.PI / 180
    );
    geo.y = Math.round(
        offset - radius * Math.log(
            (
                1 + Math.sin(
                    geo.latitude * Math.PI / 180.0
                )
            ) / (
                1 - Math.sin(
                    geo.latitude * Math.PI / 180.0
                )
            )
        ) / 2.0
    );
    return geo;
};

/**
 * Returns a Ti.MAP friendly region, based upon a zoom level.
 *
 * @author Héctor Menéndez <etor.mx@gmail.com>
 * @created 2012/AUG/01 04:23
 */
Geo.region = function(geo){

    if (
        typeof geo           != 'object' ||
        typeof geo.zoom      != 'number' ||
        typeof geo.latitude  != 'number' ||
        typeof geo.longitude != 'number' ||
        typeof geo.width     != 'number' ||
        typeof geo.height    != 'number'
    )
        return false;

    geo.zoom = geo.zoom > Geo.zoomax? Geo.zoomax : geo.zoom;

    // get pixel information for coordinates
    geo = Geo.toPixel(geo);

    var factor = Math.pow(2, Geo.zoomax - geo.zoom);
    geo.width   = geo.width  * factor;
    geo.height  = geo.height * factor;

    var x = geo.x - (geo.width  / 2);
    var y = geo.y - (geo.height / 2);
    var w =  x + geo.width;
    var h =  y + geo.height;

    var neo = Geo.toCoord({ x:w, y:h });

    return {
        latitude       : geo.latitude,
        longitude      : geo.longitude,
        latitudeDelta  : Math.abs(neo.latitude - geo.latitude),
        longitudeDelta : Math.abs(neo.longitude - geo.longitude)
    };
};

module.exports = Geo;