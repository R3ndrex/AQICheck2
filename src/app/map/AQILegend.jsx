const levels = [
    { color: "#009966", label: "Good (0–50)" },
    { color: "#ffde33", label: "Moderate (51–100)" },
    { color: "#ff9933", label: "Unhealthy for Sensitive Groups (101–150)" },
    { color: "#cc0033", label: "Unhealthy (151–200)" },
    { color: "#660099", label: "Very Unhealthy (201–300)" },
    { color: "#7e0023", label: "Hazardous (301+)" },
];

export default function AQILegend() {
    return (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-md shadow-md p-3 text-sm z-[1000]">
            <h4 className="font-semibold mb-2">AQI Levels</h4>
            <ul>
                {levels.map((level, idx) => (
                    <li key={idx} className="flex items-center mb-1 last:mb-0">
                        <span
                            className="w-4 h-4 rounded-sm mr-2"
                            style={{ backgroundColor: level.color }}
                        ></span>
                        <span>{level.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
