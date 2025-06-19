"use client";
import PollutionForecast from "./PollutionForecast.jsx";
import { getAQILevel } from "./map/AQILegend.jsx";
import useCityName from "./utils/useCityName.jsx";
import OpenWeatherForecast from "./OpenWeatherForecast.jsx";

export default function DataSection({ data, source }) {
    const city = useCityName(data.coord?.lat, data.coord?.lon);

    if (source === "waqi") {
        const DailyArray = Object.entries(data.data.forecast.daily);
        return (
            <main className="flex gap-5 flex-col items-center m-5">
                <section>
                    <h1 className="text-2xl">{data.data.city.name}</h1>
                    <p>
                        AQI:{" "}
                        <span
                            className="font-semibold"
                            style={{
                                color: getAQILevel(data.data.aqi).color,
                            }}
                        >
                            {data.data.aqi}
                        </span>
                    </p>
                </section>
                {DailyArray.map(([pollutionName, pollutionValue]) => (
                    <PollutionForecast
                        pollutionData={pollutionValue}
                        pollutionName={pollutionName}
                        key={pollutionName}
                    />
                ))}
            </main>
        );
    }

    if (
        source === "openweather" &&
        Array.isArray(data.list) &&
        data.list.length > 0
    ) {
        return (
            <main className="flex gap-5 flex-col items-center m-5">
                <section>
                    <h1 className="text-2xl">{city}</h1>
                    <p>
                        AQI:{" "}
                        <span
                            className="font-semibold"
                            style={{
                                color: getAQILevel(data.list[0].main.aqi).color,
                            }}
                        >
                            {data.list[0].main.aqi}
                        </span>
                    </p>
                </section>
                <OpenWeatherForecast data={data} />
            </main>
        );
    }

    return null;
}
