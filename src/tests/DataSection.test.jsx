import { render, screen } from "@testing-library/react";

import DataSection from "@/app/DataSection";

import { vi } from "vitest";

vi.mock("../utils/useCityName.jsx", () => ({
    default: () => "Kyiv",
}));

vi.mock("../map/AQILegend.jsx", () => ({
    getAQILevel: (aqi) => ({
        color: aqi > 100 ? "red" : "green",
        text: aqi > 100 ? "Unhealthy" : "Good",
    }),
}));

const mockData = {
    data: {
        aqi: 50,
        city: { name: "Kyiv" },
        forecast: {
            daily: {
                pm10: [{ day: "2025-06-19", avg: 20 }],
                pm25: [{ day: "2025-06-19", avg: 10 }],
            },
        },
    },
    coord: { lat: 50.45, lon: 30.52 },
};

describe("DataSection component", () => {
    it("renders WAQI data correctly", () => {
        render(<DataSection data={mockData} source="waqi" />);
        expect(screen.getByText("Kyiv")).toBeInTheDocument();
        expect(screen.getByText("AQI:")).toBeInTheDocument();
        expect(screen.getByText("50")).toHaveStyle({ color: "green" });
        expect(screen.getByText("Good")).toBeInTheDocument();
    });
});
