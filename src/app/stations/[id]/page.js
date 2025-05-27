"use client";

import { useEffect, useState } from "react";
import AQIHistoricalChart from "../AQIHistoricalChart";
import { useRouter, useParams } from "next/navigation";

export default function StationsPage() {
    const router = useRouter();
    const params = useParams();
    const stationId = params?.id;

    const [stations, setStations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStations() {
            try {
                const res = await fetch("/api/stations");
                if (!res.ok) throw new Error("Ошибка загрузки станций");
                const data = await res.json();
                setStations(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStations();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const selectedStation = stationId
        ? stations.find((s) => s._id === stationId)
        : null;

    if (stationId && !selectedStation && stations.length > 0) {
        return (
            <main className="m-5">
                <button
                    className="mb-4 text-blue-600 font-semibold cursor-pointer"
                    onClick={() => router.push("/stations")}
                >
                    Go back to station list
                </button>
                <p>Station not found</p>
            </main>
        );
    }

    if (stationId && selectedStation) {
        return (
            <main className="m-5 flex flex-col items-center">
                <button
                    className="mb-4 self-start text-blue-600 font-semibold cursor-pointer"
                    onClick={() => router.push("/stations")}
                >
                    Go back to station list
                </button>
                <h1 className="text-3xl mb-3 capitalize">
                    {selectedStation.name}
                </h1>
                <p>Longitude: {selectedStation.lon}</p>
                <p>Latitude: {selectedStation.lat}</p>
                <p>AQI: {selectedStation.aqi}</p>

                <section className="mt-6 w-[90%] flex flex-col items-center">
                    <AQIHistoricalChart data={selectedStation} />
                </section>
            </main>
        );
    }
}
