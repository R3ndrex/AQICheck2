"use client";
import { useEffect, useState } from "react";
import AQIHistoricalChart from "./AQIHistoricalChart";

export default function StationList() {
    const [stations, setStations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStations() {
            try {
                const res = await fetch("/api/stations");
                if (!res.ok) throw new Error("Error while loading");
                const data = await res.json();
                setStations(data);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchStations();
    }, []);

    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <section className="m-5">
                <h2 className="text-2xl mb-4">Station List</h2>
                {stations.length === 0 ? (
                    <p>No stations</p>
                ) : (
                    <table className="w-full border border-gray-300">
                        <thead className="bg-emerald-100">
                            <tr>
                                <th className="border p-2 text-left">Name</th>
                                <th className="border p-2 text-left">
                                    Longitude
                                </th>
                                <th className="border p-2 text-left">
                                    Latitude
                                </th>
                                <th className="border p-2 text-left">
                                    AQI (current / history)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stations.map((station) => {
                                return (
                                    <tr key={station._id} className="align-top">
                                        <td className="border p-2 capitalize">
                                            {station.name}
                                        </td>
                                        <td className="border p-2">
                                            {station.lon}
                                        </td>
                                        <td className="border p-2">
                                            {station.lat}
                                        </td>
                                        <td className="border p-2">
                                            <span className="font-semibold">
                                                {station.aqi}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
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
            {stations[0] && (
                <section>{<AQIHistoricalChart data={stations[0]} />}</section>
            )}
        </>
    );
}
