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


class PlanetContainer extends React.Component {

  constructor(props) {
    super(props);
    // Initialize speed and color from API
    var planets = ["Mercury", 
                   "Venus",
                   "Earth",
                   "Mars",
                   "Jupiter",
                   "Saturn",
                   "Uranus",
                   "Neptune"];
    this.state = {};

    for (var planet of planets){
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

  render (){

    return (
      <Table>
        <tbody>
          <tr>
            <td colSpan="3" style={{"text-align": "center"}}>
              <ButtonGroup className="mr-2" style={{"text-align": "center"}}>
                <Button variant="outline-primary">Reading Mode</Button>
                <Button variant="outline-primary">Planet Mode</Button>
                <Button variant="outline-primary">Stop All</Button>
              </ButtonGroup>
            </td>
          </tr>
          
          <PlanetController eventKey="0" name="Mercury" 
                            color={this.state["Mercury.color"]}
                            speed={this.state["Mercury.speed"]}
                            planetColor="#d8d8d8"
	    		    onSpeedChange={this.create_speed_cb("Mercury")}
			    onColorChange={this.create_color_cb("Mercury")}/>
          <PlanetController eventKey="1" name="Venus"
                            color={this.state["Venus.color"]}
                            speed={this.state["Venus.speed"]}
                            planetColor="#695a33"/>
          <PlanetController eventKey="2" name="Earth"
                            color={this.state["Earth.color"]}
                            speed={this.state["Earth.speed"]}
                            planetColor="#005dff"/>
          <PlanetController eventKey="3" name="Mars"
                            color={this.state["Mars.color"]}
                            speed={this.state["Mars.speed"]}
                            planetColor="#ff0000"/>
          <PlanetController eventKey="4" name="Jupiter"
                            color={this.state["Jupiter.color"]}
                            speed={this.state["Jupiter.speed"]}
                            planetColor="#a85838"/>
          <PlanetController eventKey="5" name="Saturn"
                            color={this.state["Saturn.color"]}
                            speed={this.state["Saturn.speed"]}
                            planetColor="#f2f56b"/>
          <PlanetController eventKey="6" name="Uranus"
                            color={this.state["Uranus.color"]}
                            speed={this.state["Uranus.speed"]}
                            planetColor="#00ddb1"/>
          <PlanetController eventKey="7" name="Neptune"
                            color={this.state["Neptune.color"]}
                            speed={this.state["Neptune.speed"]}
                            planetColor="#306dff"/>
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
    var [red, green, blue, white] = this.hex_to_color(new_color.color);
    this.props.onColorChange(red, green, blue, white);
  }

  hex_to_color(rgb_string){
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
              <Button variant="primary">
                White
              </Button>
              <Button variant="primary">
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
            Speed {this.props.speed - 128}
          </td>
          <td colSpan="2">
            <Slider min={0} max={256} step={16} 
                    startPoint={128} 
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
