import {
    LineChart,
    Line,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
function formatDate(date) {
    const newDate = new Date(date);
    return `${String(newDate.getMonth() + 1).padStart(2, "0")}.${String(
        newDate.getDate()
    ).padStart(2, "0")}`;
}
export default function PollutionChart({ data, dataKeys }) {
    return (
        <div className="graph">
            <ResponsiveContainer>
                <LineChart data={data}>
                    {dataKeys.map((key) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={
                                key === "max"
                                    ? "#ff0000"
                                    : key === "min"
                                    ? "#008000"
                                    : "#ffd900"
                            }
                        />
                    ))}

                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis
                        dataKey={"day"}
                        tickFormatter={formatDate}
                        interval="preserveStartEnd"
                    />
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
