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
      api.get_speed(planet).then(
        resp=> {
          this.setState((state, props) => {
            var key = planet + '.speed';
            return {[key]: resp[planet]};
          });
        }); 

      api.get_color(planet).then(
        resp=> {
          this.setState((state, props) => {
            console.log(resp);
            var key = planet + '.color';
            var [red, green, blue, white] = resp[planet];
            var color_string = this.color_as_hex_string(
              red, green, blue, white);
            return {[key]: color_string}
          })
        });
    }
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
                            planetColor="#d8d8d8"/>
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
    this.wrapper = React.createRef();

    // Initialize speed and color from the API
    var planet = this.props.name;
    api.get_speed(planet).then(
      resp => {
        this.setState((state, props) => { 
          return {speed: resp[planet]};
        })
      });
    api.get_color(planet).then(
      resp => {
        this.setState((state, props) => {
          var [red, green, blue, white] = resp[planet];
          var color_string = shared.color_as_hex_string(
            red, green, blue, white);
          return {color: color_string};
        });
      });

    this.state = {};

    console.log(planet, this.state);
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
            <ColorPicker color={this.state.color} 
                         placement="bottomRight" 
                         onChange={(value) => {
              var [red, green, blue, white] = this.hex_to_color(value.color);
              self.setState((state, props) => {
                return {color: value.color};
              });
              api.set_color(this.props.name, red, green, blue, white);
            }}/>
          </td>
        </tr>
        <tr>
          <td>
            Speed {this.state.speed - 128}
          </td>
          <td colSpan="2">
            <Slider min={0} max={256} step={16} 
                    startPoint={128} 
                    value={this.state['speed']}
                    onChange={value => {
                      this.setState((state, props) => {
                        api.set_speed(this.props.name, value); 
                        return {speed: value};});
                      }} />
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
