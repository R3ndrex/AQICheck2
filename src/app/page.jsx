"use client";

import { useState } from "react";
import { useUserLocation } from "./context/UserLocationContext";
import DataSection from "./DataSection.jsx";
import isCityReal from "./utils/isCityReal";
import Template from "./template";
function MainPage() {
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const userLocation = useUserLocation();

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

    function handleSubmit() {
        setError(null);
        setData(null);
        setLoading(true);
        fetchData(inputValue)
            .then((response) => {
                setData(response);
                setError(null);
            })
            .catch((error) => {
                if (error.name !== "AbortError") setError(error.message);
                setData(null);
            })
            .finally(() => setLoading(false));
    }

    function handleGeoSubmit() {
        setError(null);
        setData(null);
        setLoading(true);

        if (userLocation) {
            fetchData(`geo:${userLocation.latitude};${userLocation.longitude}`)
                .then((response) => {
                    if (
                        isCityReal(
                            userLocation.latitude,
                            userLocation.longitude,
                            response.data.city.name
                        )
                    ) {
                        setData(response);
                        setError(null);
                    } else {
                        fetch(
                            `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_TOKEN}`
                        )
                            .then((response) =>
                                response.json().then((data) => {
                                    setData(data);
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
    if (loading) {
        return (
            <div className="flex h-[90vh] items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }
    return (
        <>
            <header
                className={`flex flex-col justify-center items-center m-5 ${
                    data || loading || error ? "mt-9" : "mt-[33vh]"
                }`}
            >
                <h1 className="text-2xl">AQI Check</h1>
                <input
                    type="text"
                    required
                    name="city"
                    id="city"
                    placeholder="Enter your city"
                    autoFocus
                    className="placeholder-slate-400 p-1"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="flex gap-5">
                    <button
                        className="pb-2 mt-3 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-emerald-200"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Get data
                    </button>
                    <button
                        className="pb-2 mt-3 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-emerald-200"
                        onClick={handleGeoSubmit}
                    >
                        Get exact data
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
                    <DataSection data={data} />
                </Template>
            )}
        </>
    );
}

export default MainPage;
