import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
export default function AQIHistoricalChart({ data }) {
    const color = "#ff4500";

    return (
        <section className="inline-flex gap-5 w-[90%] flex-wrap items-center justify-center border-1 p-5">
            <div className="flex flex-col w-full items-center">
                <h2 className="text-2xl capitalize">AQI Forecast</h2>
                <AQIChart data={data} pollutant="aqi" color={color} />
            </div>
        </section>
    );
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleString([], { dateStyle: "short", timeStyle: "short" });
}

function AQIChart({ data, pollutant, color }) {
    console.log(data);
    const chartData = data.aqiHistory.map((entry) => {
        return {
            time: entry.recordedAt,
            value: entry.aqi,
        };
    });

    return (
        <div className="graph h-[350px]">
            <h2 className="text-lg font-semibold mb-2 capitalize">
                {pollutant}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tickFormatter={formatDate}
                        interval="preserveStartEnd"
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={(label) =>
                            new Date(label).toLocaleString()
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
