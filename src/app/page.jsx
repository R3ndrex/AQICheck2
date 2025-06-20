"use client";

import { useEffect, useRef, useState } from "react";
import { useUserLocation } from "./context/UserLocationContext";
import DataSection from "./DataSection.jsx";
import isCityReal from "./utils/isCityReal";
import Template from "./template";
import cityList from "./utils/cities.json";

function MainPage() {
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const ref = useRef();
    const [suggestions, setSuggestions] = useState([]);
    const userLocation = useUserLocation();

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Enter") ref.current?.focus();
        });
    }, []);

    async function fetchData(request) {
        const response = await fetch(
            `https://api.waqi.info/feed/${request}/?token=${process.env.NEXT_PUBLIC_TOKEN}`
        );
        if (!response.ok)
            throw new Error("There is a problem with fetching data");

        const json = await response.json();
        if (json.status === "error") {
            throw new Error(json.data);
        }
        return json;
    }

    async function handleSubmit() {
        setError(null);
        setData(null);
        setLoading(true);

        try {
            const response = await fetch(
                `https://api.waqi.info/feed/${inputValue}/?token=${process.env.NEXT_PUBLIC_TOKEN}`
            );

            if (!response.ok) {
                throw new Error("There is a problem with fetching WAQI data");
            }

            const waqiData = await response.json();

            if (waqiData.status === "error") {
                throw new Error(waqiData.data);
            }

            const today = new Date().toISOString().split("T")[0];
            const pm10Array = waqiData?.data?.forecast?.daily?.pm10;

            const hasTodayData =
                Array.isArray(pm10Array) &&
                pm10Array.some((item) => item.day === today);
            if (hasTodayData) {
                setData({
                    source: "waqi",
                    payload: waqiData,
                });
            } else {
                const [lat, lon] = waqiData?.data?.city?.geo || [];

                if (!lat || !lon)
                    throw new Error("Coordinates not found for OpenWeather");

                const openWeatherResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_TOKEN}`
                );

                if (!openWeatherResponse.ok) {
                    throw new Error("Failed to fetch OpenWeather data");
                }

                const openWeatherData = await openWeatherResponse.json();

                setData({
                    source: "openweather",
                    payload: openWeatherData,
                });
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                setError(error.message);
            }
            setData(null);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {}, []);

    function handleGeoSubmit() {
        setError(null);
        setData(null);
        setLoading(true);

        if (userLocation) {
            fetchData(`geo:${userLocation.latitude};${userLocation.longitude}`)
                .then((response) => {
                    const isReal = isCityReal(
                        userLocation.latitude,
                        userLocation.longitude,
                        response.data.city.name
                    );

                    const pm10Forecast =
                        response?.data?.forecast?.daily?.pm10?.[0];
                    const isToday = pm10Forecast && pm10Forecast.day === today;

                    if (isReal && isToday) {
                        setData({
                            source: "waqi",
                            payload: response,
                        });
                        setError(null);
                    } else {
                        fetch(
                            `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_TOKEN}`
                        )
                            .then((response) =>
                                response.json().then((openWeatherData) => {
                                    setData({
                                        source: "openweather",
                                        payload: openWeatherData,
                                    });
                                    setError(null);
                                })
                            )
                            .catch((error) => setError(error.message));
                    }
                })
                .catch((error) => {
                    if (error.name !== "AbortError") setError(error.message);
                    setData(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
            setError("Browser doesn't support geolocation");
        }
    }

    return (
        <>
            <header
                className={`flex flex-col justify-center items-center m-5 main-header ${
                    (data && !loading) || error ? "mt-9" : "mt-[33vh]"
                }`}
            >
                <h1 className="text-2xl">AQI Check</h1>
                <div className="flex flex-col m-3">
                    <input
                        type="text"
                        required
                        name="city"
                        id="city"
                        placeholder="Enter your city"
                        ref={ref}
                        autoFocus
                        className="placeholder-slate-400 p-1"
                        value={inputValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            setInputValue(value);

                            if (value.length > 0) {
                                const filtered = cityList
                                    .filter((city) =>
                                        city.name
                                            .toLowerCase()
                                            .startsWith(value.toLowerCase())
                                    )
                                    .slice(0, 5);
                                setSuggestions(filtered);
                            } else {
                                setSuggestions([]);
                            }
                        }}
                    />
                    <ul className="bg-white text-black w-[300px] mt-1 max-h-[150px] overflow-y-auto rounded shadow suggestions">
                        {suggestions.map((city) => (
                            <li
                                key={city.id}
                                className="p-2 hover:bg-emerald-100 cursor-pointer"
                                onClick={() => {
                                    setInputValue(city.name);
                                    setSuggestions([]);
                                }}
                            >
                                {city.name}, {city.country}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex gap-5">
                    <button
                        className="pb-2 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-emerald-200"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Get data
                    </button>
                    <button
                        className="pb-2 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-emerald-200"
                        onClick={handleGeoSubmit}
                    >
                        Get geo data
                    </button>
                </div>
            </header>

            {!error && !data && !loading && (
                <div className="text-gray-300 text-center text-xl mt-7">
                    <p>
                        No data to display. Enter city name or press «Get exact
                        data».
                    </p>
                </div>
            )}
            {error && (
                <h2 className="text-2xl text-red-500 mt-5 flex items-center justify-center">
                    Error: {error}
                </h2>
            )}
            {data && (
                <Template>
                    <DataSection data={data.payload} source={data.source} />
                </Template>
            )}
        </>
    );
}

export default MainPage;
