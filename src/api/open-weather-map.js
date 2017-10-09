import axios from 'axios';

// TODO replace the key with yours
const key = 'dbb24fdd4ef086e081b8df071b00ae7d'; //dbb24fdd4ef086e081b8df071b00ae7d
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${key}`;
const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?&appid=${key}`;

export function getWeatherGroup(code) {
    let group = 'na';
    if (200 <= code && code < 300) {
        group = 'thunderstorm';
    } else if (300 <= code && code < 400) {
        group = 'drizzle';
    } else if (500 <= code && code < 600) {
        group = 'rain';
    } else if (600 <= code && code < 700) {
        group = 'snow';
    } else if (700 <= code && code < 800) {
        group = 'atmosphere';
    } else if (800 === code) {
        group = 'clear';
    } else if (801 <= code && code < 900) {
        group = 'clouds';
    }
    return group;
}

export function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
}

let weatherSource = axios.CancelToken.source();

export function getWeather(city, unit) {
    var url = `${baseUrl}&q=${encodeURIComponent(city)}&units=${unit}`;

    console.log(`Making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            return {
                
                city: capitalize(city),
                code: res.data.weather[0].id,
                group: getWeatherGroup(res.data.weather[0].id),
                description: res.data.weather[0].description,
                temp: res.data.main.temp,
                unit: unit // or 'imperial'
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelWeather() {
    weatherSource.cancel('Request canceled');
}

export function getForecast(city, unit) {

    var url = `${forecastUrl}&q=${encodeURIComponent(city)}&units=${unit}`;

    console.log(`Making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
 
        if (res.data.cod != 200) {
            throw new Error(res.data.message);
        } else { //4, 12, 20, 28, 36
            var sub = [res.data.list[4], res.data.list[12],res.data.list[20],res.data.list[28],res.data.list[36]];
            var ret = sub.map(function (obj, index) {
                return { 
                    idx: index,
                    city: capitalize(city),
                    code: obj.weather[0].id,
                    group: getWeatherGroup(obj.weather[0].id),
                    description: obj.weather[0].description,
                    temp: obj.main.temp,
                    unit: unit // or 'imperial'
                };
            });

            return ret;
            //debugger;
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelForecast() {
    // TODO
}
