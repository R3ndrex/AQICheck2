const levels = [
    {
        min: 0,
        max: 50,
        color: "#009966",
        label: "Good (0–50)",
        text: "Air quality is considered satisfactory, and air pollution poses little or no risk",
    },
    {
        min: 51,
        max: 100,
        color: "#ffde33",
        label: "Moderate (51–100)",
        text: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.",
    },
    {
        min: 101,
        max: 150,
        color: "#ff9933",
        label: "Unhealthy for Sensitive (101–150)",
        text: "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
    },
    {
        min: 151,
        max: 200,
        color: "#cc0033",
        label: "Unhealthy (151–200)",
        text: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects",
    },
    {
        min: 201,
        max: 300,
        color: "#660099",
        label: "Very Unhealthy (201–300)",
        text: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
    },
    {
        min: 301,
        max: Infinity,
        color: "#7e0023",
        label: "Hazardous (301+)",
        text: "Health alert: everyone may experience more serious health effects",
    },
];

export function getAQILevel(aqi) {
    return levels.find((level) => aqi >= level.min && aqi <= level.max);
}
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
