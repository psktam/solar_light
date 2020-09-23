import shared from './shared.js';


async function get_speed(planet){
    // Returns a promise whose input value is the JSON-decoded response
    var api_query = '/api/get_speed/' + planet;
    const res = await fetch(api_query);
    return await res.json();
}


async function set_speed(planet, speed){
    // Set the speed for the planet
    var api_query = '/api/set_speed/' + planet + '/' + speed;
    const res = await fetch(api_query);
    return await res.json();
}


async function get_color(planet){
    // Returns a promise that contains the RGBW color spec for the planet
    var api_query = '/api/get_color/' + planet;
    const res = await fetch(api_query);
    return await res.json();
}


async function set_color(planet, red, green, blue, white){
    // Set the color of the planet
    var color_hex = (shared.to_hex(red) + 
                     shared.to_hex(green) + 
                     shared.to_hex(blue) + 
                     shared.to_hex(white));

    var api_query = '/api/set_color/' + planet + '/' + color_hex;
    const res = await fetch(api_query);
    return await res.json();
}


const to_export = {
    "get_speed": get_speed,
    "set_speed": set_speed,
    "get_color": get_color,
    "set_color": set_color
};

export default to_export;