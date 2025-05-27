"use client";
import PollutionForecast from "./PollutionForecast.jsx";
import { getAQILevel } from "./map/AQILegend.jsx";
import useCityName from "./utils/useCityName.jsx";
import OpenWeatherForecast from "./OpenWeatherForecast.jsx";
export default function DataSection({ data }) {
    const city = useCityName(data.coord?.lat, data.coord?.lon);
    let DailyArray = null;
    try {
        DailyArray = Object.entries(data.data.forecast.daily);
    } catch (e) {}
    return (
        <>
            {DailyArray && (
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
            )}
            {data.coord && (
                <main className="flex gap-5 flex-col items-center m-5">
                    <section>
                        <h1 className="text-2xl">{city}</h1>
                        <p>
                            AQI:{" "}
                            <span
                                className="font-semibold"
                                style={{
                                    color: getAQILevel(data.list[0].main.aqi)
                                        .color,
                                }}
                            >
                                {data.list[0].main.aqi}
                            </span>
                        </p>
                    </section>
                    <OpenWeatherForecast data={data} />
                </main>
            )}
        </>
    );
}
