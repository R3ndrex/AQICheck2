"use client";
import PollutionForecast from "./PollutionForecast.jsx";

export default function DataSection({ data }) {
    const DailyArray = Object.entries(data.data.forecast.daily);
    return (
        <main className="flex gap-5 flex-col items-center m-5">
            <section>
                <h1 className="text-2xl">{data.data.city.name}</h1>
                <p>AQI: {data.data.aqi}</p>
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
