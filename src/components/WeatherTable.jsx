import React from 'react';
import { Table } from 'reactstrap';
import WeatherDisplay from 'components/WeatherDisplay.jsx';

export default class WeatherTable extends React.Component {
  // static propTypes = {

  // };
  constructor(props) {
    super(props);
    
    // {<tr>{this.props.weatherList.map((m=><td key={m.idx}>{m.temp}</td>))}</tr>}
  }
  componentDidMount() {
    //console.log(Array.isArray(this.props.weatherList));
    //debugger;
  
//     //this.getForecast('Hsinchu', 'metric');
  }
  render() {
    return (
      <Table inverse>
        <tbody>
          {<tr>{this.props.weatherList.map((m=><td key={m.idx}>
          <WeatherDisplay {...m} /></td>))}</tr>}
        </tbody>
      </Table>
    );
  }
}