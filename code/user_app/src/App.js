// Standard imports
import React from 'react';
import ReactDOM from 'react-dom';

// 3rd-party imports
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Local imports
import './App.css';


class PlanetController extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.state = {
      speed: 12,
      color: [0, 0, 0, 0]
    };
  }

  render() {
    var self = this;

    function speed_callback(value){
      var api_query = '/api/set_speed/' + self.props.name + '/' + value;
      console.log("Querying ", api_query);
      fetch(api_query).then(res => res.json()).then(data => console.log(data));
    }

    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey={this.props.eventKey}>
          {this.props.name}
        </Accordion.Toggle>
        <br/>
        <Slider min={0} max={256} step={16}
                startPoint={127} 
                onChange={speed_callback}
                defaultValue={127}/>
        <br/>
        <Accordion.Collapse eventKey={this.props.eventKey}>
          <Card.Body>
            This is where you put additional controls for {this.props.name}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}


function App() {
  return (
    <div className="App">
      <h1>Pick a Planet</h1>
      <Accordion>
        <PlanetController eventKey="0" name="Mercury"/>
        <PlanetController eventKey="1" name="Venus"/>
        <PlanetController eventKey="2" name="Earth"/>
        <PlanetController eventKey="3" name="Mars"/>
        <PlanetController eventKey="4" name="Jupiter"/>
        <PlanetController eventKey="5" name="Saturn"/>
        <PlanetController eventKey="6" name="Uranus"/>
        <PlanetController eventKey="7" name="Neptune"/>
      </Accordion>
    </div>
  );
}

export default App;
