import PollutionChart from "./PollutionChart";

export default function PollutionForecast({ pollutionData, pollutionName }) {
    return (
        <section className="inline-flex gap-5 flex-wrap items-center justify-center border-1 p-5">
            <div className="flex flex-col w-full items-center">
                <h2 className="text-2xl capitalize">
                    {pollutionName} Forecast
                </h2>
                <PollutionChart
                    data={pollutionData}
                    dataKeys={["avg", "max", "min"]}
                />
            </div>
            <div className="grid grid-cols-3 items-center h-min gap-[1.5rem]">
                {pollutionData.map((day) => (
                    <div key={day.day} className="flex flex-col justify-center">
                        <h3>Day: {day.day}</h3>
                        <ul>
                            <li>Max: {day.max}</li>
                            <li>Min: {day.min}</li>
                            <li>Average: {day.avg}</li>
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
