
/**
 * Make Resources/config property extend the one specified on module.
 * @param {Object} name
 * @param {Object} config
 */
module.exports = function(name, config){
    var Config;
    if (typeof config != 'object') config = {};
    // Throw any error found on config;
    try { Config = require('config'); } catch(e){
        throw 'Configuration: ' + String(e);
    }
    // if no config override is specified, return module's.
    if (typeof Config[name] != 'object') return config;
    // extend configuration 
    for(var i in Config[name])
        if (Config[name].hasOwnProperty(i))
            config[i] = Config[name][i];
    return config;
};
