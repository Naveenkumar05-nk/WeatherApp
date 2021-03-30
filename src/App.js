import React from 'react';

import './App.css';

// weather icons from github - https://github.com/erikflowers/weather-icons.git
import 'weather-icons/css/weather-icons.css';

// To import the bootstrap in the project(install command - npm i bootstrap)
import 'bootstrap/dist/css/bootstrap.min.css';

import Weather from './app_component/weather.component';

import Form from './app_component/form.component';

// api call api.openweathermap.org/data/2.5/weather?q=London,uk
const API_KEY = "fd685eea4643b4f64c429b131ac484fd";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description:"",
      error: false 
    };
  

  // To specify the icons for the weather

    this.weatherIcon={
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog"
    }
  }

  // To convert the temp in celsius

  calCelsius(temp){
    let cell = Math.floor(temp-273.15);
    return cell;
  }

  // To specify the icon according to the id lying in th range of the openweather api
  // https://openweathermap.org/weather-conditions

  get_WeatherIcon(icons,rangeId){
    switch(true){
      case rangeId >= 200 && rangeId < 232:
        this.setState({ icon: icons.Thunderstorm });
        break;

      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: icons.Drizzle });
        break;

      case rangeId >= 500 && rangeId <= 521:
        this.setState({ icon: icons.Rain });
        break;

      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: icons.Snow });
        break;

      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: icons.Atmosphere });
        break;

      case rangeId === 800:
        this.setState({ icon: icons.Clear });
        break;

      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: icons.Clouds });
        break;

      default:
        this.setState({ icon: icons.Clouds });
        

    }
  }

  // Fetching api asynchronously
  getWeather = async(e) =>{
    
    // To stop the default behaviour of the button Get weather
    e.preventDefault();

    const country = e.target.elements.country.value;
    const city = e.target.elements.city.value;
    
    // If the user specifies the city and the country
    if(city && country) {
    const api_call = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`
    );

    const response = await api_call.json();

    console.log(response);

    this.setState({
       city:`${response.name}, ${response.sys.country}`,
       celsius: this.calCelsius(response.main.temp),
       temp_max: this.calCelsius(response.main.temp_max),
       temp_min: this.calCelsius(response.main.temp_min),
       description: response.weather[0].description,
       
    });

  // To get the weather id needed for the icon specification

  this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);
  
  // if the user don't specify the city and the country - ERROR MESSAGE
    console.log(response);
  } else {
    this.setState({
      error: true
    });

    }

  };

  // 23.55
  render() {
    return (
      <div className="App">
        <Form loadweather={this.getWeather} error={this.state.error}/>
        <Weather 
        city={this.state.city} 
        country={this.state.country} 
        temp_celsius={this.state.celsius}
        temp_max={this.state.temp_max}
        temp_min={this.state.temp_min}
        description={this.state.description}
        weatherIcon={this.state.icon}/>
      
      {/* <div style={{color: "white"}}>
      Made with ❤ by Naveen Kumar
      </div> */}
      </div>

    );
  }
}


export default App;
