"use client";

import { useEffect, useState } from "react";
import AddStationForm from "./AddStationForm";
import { useRouter } from "next/navigation";
import { getAQILevel } from "../map/AQILegend";
export default function StationsListPage() {
    const router = useRouter();

    const [sortedStations, setSortedStations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStations() {
            try {
                const res = await fetch("/api/stations");
                if (!res.ok) throw new Error("Ошибка загрузки станций");
                const data = await res.json();

                setSortedStations({
                    stationData: data.toSorted(
                        (a, b) =>
                            a.aqiHistory[a.aqiHistory.length - 1].aqi -
                            b.aqiHistory[b.aqiHistory.length - 1].aqi
                    ),
                    sortType: "aqiToLow",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                console.log(sortedStations);
            }
        }

        fetchStations();
    }, []);

    if (loading)
        return (
            <div className="flex mt-5 items-center w-[full] h-[90vh] justify-center">
                <div className="loader"></div>
            </div>
        );

    if (error) return <p>Error: {error}</p>;
    function reverseArray() {
        setSortedStations((prev) => ({
            stationData: prev.stationData.toReversed(),
            sortType: prev.sortType === "aqiToHigh" ? "aqiToLow" : "aqiToHigh",
        }));
    }
    return (
        <main className="flex flex-wrap justify-center items-top mt-14">
            <AddStationForm />
            <section className="m-5">
                <h2 className="text-2xl mb-4">Station List </h2>
                {sortedStations.stationData.length === 0 ? (
                    <p>No stations </p>
                ) : (
                    <table className="w-full border border-gray-300">
                        <thead className="bg-emerald-100">
                            <tr>
                                <th className="border p-2 text-left">Name </th>
                                <th className="border p-2 text-left">
                                    Longitude
                                </th>
                                <th className="border p-2 text-left">
                                    Latitude
                                </th>
                                <th
                                    onClick={reverseArray}
                                    className="border p-2 text-left"
                                >
                                    Current AQI{" "}
                                    {sortedStations.sortType === "aqiToLow" ? (
                                        <span>▼</span>
                                    ) : (
                                        <span>▲</span>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStations.stationData.map(
                                (station, index) => (
                                    <tr
                                        key={station._id}
                                        className="align-top cursor-pointer hover:bg-gray-100"
                                        onClick={() =>
                                            router.push(`/stations/${index}`)
                                        }
                                    >
                                        <td className="border p-2 capitalize">
                                            {station.name}
                                        </td>
                                        <td className="border p-2">
                                            {station.lon}
                                        </td>
                                        <td className="border p-2">
                                            {station.lat}
                                        </td>
                                        <td className="border p-2 font-semibold">
                                            <span
                                                style={{
                                                    color: getAQILevel(
                                                        station.aqiHistory[
                                                            station.aqiHistory
                                                                .length - 1
                                                        ].aqi
                                                    ).color,
                                                }}
                                            >
                                                {
                                                    station.aqiHistory[
                                                        station.aqiHistory
                                                            .length - 1
                                                    ].aqi
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                )
                            )}
                            <tr>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </section>
        </main>
    );
}
