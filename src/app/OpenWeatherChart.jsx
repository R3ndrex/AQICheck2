import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import formatDate from "./utils/formatDate";

export default function OpenWeatherChart({ data, pollutant, color }) {
    const chartData = data.list.map((entry) => {
        const date = new Date(entry.dt * 1000);
        return {
            time: date.toISOString(),
            value: entry.components[pollutant],
        };
    });

    return (
        <div className="graph h-[350px]">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tickFormatter={formatDate}
                        interval="preserveStartEnd"
                    />
                    <Tooltip
                        labelFormatter={(label) => {
                            return new Date(label).toLocaleString();
                        }}
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
