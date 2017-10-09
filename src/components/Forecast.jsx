import React from 'react';
import PropTypes from 'prop-types';
import {getForecast} from 'api/open-weather-map.js';
import './weather.css';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

import WeatherDisplay from 'components/WeatherDisplay.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import WeatherTable from 'components/WeatherTable.jsx';

export default class Forecast extends React.Component {
    static propTypes = {
        masking: PropTypes.bool,
        group: PropTypes.string,
        description: PropTypes.string,
        temp: PropTypes.number,
        unit: PropTypes.string,
        city: PropTypes.string,
    };

    static getInitWeatherState() {
       const GenOneItem = (i)=> {
            return {
            idx: i,
            city: 'na',
            code: -1,
            group: 'na',
            description: 'N/A',
            temp: NaN,
            list: []
            };
        };
        const res = [];
        for (let i=0; i<5; i++) {
            res.push(GenOneItem(i));
        }
        //debugger;
        return res;
    }
    
    constructor(props) {
        super(props);


        this.state = {
            list: Forecast.getInitWeatherState(),
            loading: false,
            masking: false
        };
       //debugger;
        this.handleFormQuery = this.handleFormQuery.bind(this);
        // TODO
    }

    componentDidMount() {
        this.getForecast('Hsinchu', 'metric');
    }

    componentWillUnmount() {
        if (this.state.loading) {
            cancelWeather();
        }
    }


    render() {
        return (
            <div className={`forecast weather-bg ${this.state.list[0].group}`}>
                <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                <div></div>
                    <div className={`today weather-bg ${this.state.list[0].group}`}>
                        <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                            <WeatherDisplay {...this.state.list[0]} />
                            <WeatherTable weatherList={this.state.list}/>
                            <WeatherForm city={this.state.list[0].city} unit={this.props.unit} onQuery={this.handleFormQuery} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getForecast(city, unit) {
        this.setState({
            loading: true,
            masking: true,
            city: city // set city state immediately to prevent input text (in WeatherForm) from blinking;
        }, () => { // called back after setState completes
            getForecast(city, unit).then(weather => {
                //debugger;
                this.setState({
                    list:weather,
                    ...weather,

                    loading: false
                }, () => this.notifyUnitChange(unit));

            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Forecast.getInitWeatherState(unit),
                    loading: false
                }, () => this.notifyUnitChange(unit));
            });
        });

        setTimeout(() => {
            this.setState({
                masking: false
            });
        }, 600);
    }

    handleFormQuery(city, unit) {
        //console.log(city, unit);
        //this.state.city = city;
        //this.state.unit = unit;
        this.getForecast(city, unit);
    };

    notifyUnitChange(unit) {
        if (this.props.units !== unit) {
            this.props.onUnitChange(unit);
        }
    }
}
