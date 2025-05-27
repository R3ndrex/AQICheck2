import OpenWeatherChart from "./OpenWeatherChart";

const pollutants = {
    co: "#8884d8",
    no: "#82ca9d",
    no2: "#ffc658",
    o3: "#ff7300",
    so2: "#a4de6c",
    pm2_5: "#d0ed57",
    pm10: "#8dd1e1",
    nh3: "#888888",
};

export default function OpenWeatherForecast({ data }) {
    return (
        <>
            {Object.entries(pollutants).map(([pollutant, color]) => (
                <section className="inline-flex gap-5 w-[90%] flex-wrap items-center justify-center border-1 p-5">
                    <div className="flex flex-col w-full items-center">
                        <h2 className="text-2xl capitalize">
                            {pollutant} Forecast
                        </h2>
                        <OpenWeatherChart
                            key={data.list.dt}
                            data={data}
                            pollutant={pollutant}
                            color={color}
                        />
                    </div>
                </section>
            ))}
        </>
    );
}
