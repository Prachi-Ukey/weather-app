import React, { useState } from 'react';
import clear from "../src/assets/Clear.png";
import cloud from "../src/assets/Clouds.png";
import err from "../src/assets/error.png";
import mist from "../src/assets/mist.png";
import rain from "../src/assets/Rain.png";

const Wapp = () => {
    const [search, setSearch] = useState("");  //search holds the user's input (city name), initially empty.
    const [data, setData] = useState(null);  //data will store the weather response from the API.null means nothing fetched yet.
    const [errorMsg, setErrorMsg] = useState("");  //errorMsg stores error messages to display if the API fails or the input is invalid.

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const handleInput = (event) => {  //Updates search state as the user types in the input box.
        setSearch(event.target.value);
    };

    const getWeatherIcon = (condition) => { //A function to return a corresponding image based on weather condition.
        switch (condition) {
            case "Clouds":
            case "Haze":
                return cloud;
            case "Rain":
                return rain;
            case "Mist":
                return mist;
            case "Clear":
                return clear;
            default:
                return clear;
        }
    };

    const myFun = async () => {
        if (search.trim() === "") {
            setErrorMsg("Please enter a city name.");
            setData(null);
            return;
        }

        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`);
            const jsonData = await res.json();
            console.log(jsonData);

            if (jsonData.cod === "404") {  //If city not found (404), show error.    
                setErrorMsg("Please enter a valid city name.");
                setData(null);
            } else {
                setData(jsonData);
                setErrorMsg("");
            }
        } catch (error) {  //Handles unexpected errors (e.g. network failure).
            setErrorMsg("Something went wrong. Please try again.");
            setData(null);
        }
        setSearch("");  //Clear the input field after submission.
    };

    return (
        <div className="container">
            <div className="input">
                <input placeholder="Enter City Or Country" value={search} onChange={handleInput} />
                <button onClick={myFun}><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>

            {
            errorMsg ?  //If there’s an error, show the message and an error image.
                (<div className="errorPage">
                    <p>{errorMsg}</p>
                    <img src={err} alt="error" />
                </div>) : ""
            }

            {
            data && data.weather ?   //Only runs if weather data is fetched and available.
                (<div className="weathers">
                    <h2 className="cityName">{data.name}</h2>
                    <img src={getWeatherIcon(data.weather[0].main)} alt={data.weather[0].main} />
                    <h2 className="temprature">{Math.trunc(data.main.temp)}℃</h2>
                    <p className="climate">{data.weather[0].description}</p>
                </div>) : ""
            }
        </div>
    );
};

export default Wapp;
