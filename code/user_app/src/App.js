// Standard imports
import React from 'react';
import ReactDOM from 'react-dom';

// 3rd-party imports
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ColorPicker from 'rc-color-picker';
import Slider from 'rc-slider';
import Table from 'react-bootstrap/Table';
import 'rc-slider/assets/index.css';
import 'rc-color-picker/assets/index.css';

// Local imports
import './App.css';
import api from './api.js';
import shared from './shared.js';


var _PLANETS = ["Mercury", 
                "Venus",
                "Earth",
                "Mars",
                "Jupiter",
                "Saturn",
                "Uranus",
                "Neptune"];
                // Sorry pluto :(

var _COLOR_MAPPING= {
  "Mercury": "#d8d8d8",
  "Venus": "#695a33",
  "Earth": "#005dff",
  "Mars": "#ff0000",
  "Jupiter": "#a85838",
  "Saturn": "#f2f56b",
  "Uranus": "#00ddb1",
  "Neptune": "#306dff"
};


function hex_to_color(rgb_string){
  var red = parseInt(rgb_string.slice(1, 3), 16);
  var green = parseInt(rgb_string.slice(3, 5), 16);
  var blue = parseInt(rgb_string.slice(5, 7), 16);
  var white = 0;

  if ((red === green) && (green === blue)){
    white = red;
    red = 0;
    green = 0;
    blue = 0;
  }

  return [red, green, blue, white];
}


// This is the container class that holds all of the PlanetControllers within it
class PlanetContainer extends React.Component {

  constructor(props) {
    super(props);
    // Initialize speed and color from API
    this.state = {};

    for (var planet of _PLANETS){
      api.get_speed(planet).then(((_planet)=>{
        return (resp => {
	  var key = _planet + '.speed';
	  var speed = resp[_planet];
	  this.setState({[key]: speed});
	});
      })(planet));

      api.get_color(planet).then(((_planet)=>{
        return (resp => {
	  var key = _planet + '.color';
	  var [red, green, blue, white] = resp[_planet];
	  var color_string = shared.color_as_hex_string(
	    red, green, blue, white);
	  var update = {[key]: color_string};
	  console.log("Initializing ", _planet, " color to ", color_string);
	  this.setState({[key]: color_string});
        });})(planet));
    }
  }

  create_speed_cb(planet){
    var key = planet + '.speed';
    
    return (speed) => {
      this.setState({[key]: speed});
      api.set_speed(planet, speed);
      console.log("Setting ", planet, " to ", speed);
    };
  }

  create_color_cb(planet){
    var key = planet + '.color';

    return (red, green, blue, white) => {
      
      var color_string = shared.color_as_hex_string(red, green, blue, white);
      this.setState({[key]: color_string});
      api.set_color(planet, red, green, blue, white);
    };
  }

  create_reading_mode_cb(){
    // Turn all lights to white at full brightness
    return () => {
      var color_map = {};
      for (var planet of _PLANETS){
        var key = planet + '.color';
        color_map[key] = '#ffffff';
        api.set_color(planet, 0, 0, 0, 255);
      }
      this.setState(color_map);
    }
  }

  create_planet_mode_cb(){
    // Turn all lights to their planet color
    return () => {
      var color_mapping = {}
      for (var planet of _PLANETS){
        var key = planet + '.color';
        var [red, green, blue, white] = hex_to_color(_COLOR_MAPPING[planet]);
        api.set_color(planet, red, green, blue, white);
        color_mapping[key] = _COLOR_MAPPING[planet]
      }
      this.setState(color_mapping);
    }
  }

  create_stop_cb(){
    // Stop all planets
    return () => {
      var speed_map = {};
      for (var planet of _PLANETS){
        var key = planet + '.speed';
        api.set_speed(planet, 0);
        speed_map[key] = 0.0;
      }
      this.setState(speed_map);
    }
  }

  render (){
    var planets = [..._PLANETS];
    var self = this;
    var controller_list = planets.map(function (planet) {
      return (<PlanetController name={planet}
               color={self.state[planet + '.color']}
               speed={self.state[planet + '.speed']}
               planetColor={_COLOR_MAPPING[planet]}
               onSpeedChange={self.create_speed_cb(planet)}
               onColorChange={self.create_color_cb(planet)}/>);
    });

    return (
      <Table>
        <tbody>
          <tr>
            <td colSpan="3" style={{"text-align": "center"}}>
              <ButtonGroup className="mr-2" style={{"text-align": "center"}}>
                <Button variant="outline-primary"
                        onClick={self.create_reading_mode_cb()}>Reading Mode</Button>
                <Button variant="outline-primary"
                        onClick={self.create_planet_mode_cb()}>Planet Mode</Button>
                <Button variant="outline-primary"
                        onClick={self.create_stop_cb()}>Stop All</Button>
              </ButtonGroup>
            </td>
          </tr>
          
          {controller_list}
        </tbody>
      </Table>
    );
  }
}


class PlanetController extends React.Component {
  constructor(props) {
    super(props);
    this.handle_color_change = this.handle_color_change.bind(this);
    this.handle_speed_change = this.handle_speed_change.bind(this);
  }

  handle_speed_change(speed) {
    this.props.onSpeedChange(speed);
  }

  handle_color_change(new_color) {
    var [red, green, blue, white] = hex_to_color(new_color.color);
    this.props.onColorChange(red, green, blue, white);
  }

  render() {
    var self = this;

    return (
      <div ref={React.createRef()} >
        <tr>
          <td width="120px">
            <b>{this.props.name}</b> 
          </td>
          <td style={{width: "210px"}}>
            <ButtonGroup>
              <Button variant="primary"
                      onClick={()=>this.props.onColorChange(0, 0, 0, 255)}>
                White
              </Button>
              <Button variant="primary"
                      onClick={()=>{
                        var [red, green, blue, white] = hex_to_color(
                          self.props.planetColor);
                        self.props.onColorChange(red, green, blue, white);}}>
                Planet Color
              </Button>
            </ButtonGroup>
          </td>
          <td>
            <ColorPicker color={this.props.color} 
                         placement="bottomRight" 
                         onChange={this.handle_color_change}/>
          </td>
        </tr>
        <tr>
          <td>
            Speed {this.props.speed}
          </td>
          <td colSpan="2">
            <Slider min={-100} max={100} step={10} 
                    startPoint={0} 
                    value={this.props['speed']}
                    onChange={this.handle_speed_change} />
          </td>
        </tr>
      </div>
    );
  }
}


function App() {

  return (
    <div className="App">
      <h1>Pick a Planet</h1>
      <div style={{width: "375px"}}>
        <PlanetContainer />
      </div>
    </div>
  );
}

export default App;
