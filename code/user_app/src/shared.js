function to_hex(num){
    var as_hex = num.toString(16);
    return "0".repeat(2 - as_hex.length) + as_hex;
}


function color_as_hex_string(red, green, blue, white){
  // Get color has hex string
  if ((red === 0) && (green === 0) && (blue === 0)){
    red = white;
    green = white;
    blue = white;
  }
  var color_string = (
    '#' + to_hex(red) + to_hex(green) + to_hex(blue));
  return color_string;
}

const to_export = {"to_hex": to_hex,
                   "color_as_hex_string": color_as_hex_string};
export default to_export;
