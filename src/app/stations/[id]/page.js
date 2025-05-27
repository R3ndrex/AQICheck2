"use client";

import { useEffect, useState } from "react";
import AQIHistoricalChart from "../AQIHistoricalChart";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getAQILevel } from "@/app/map/AQILegend";
export default function StationsPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session } = useSession();
    const stationId = params?.id;

    const [stations, setStations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStations() {
            try {
                const res = await fetch("/api/stations");
                if (!res.ok) throw new Error("Error loading stations");
                const data = await res.json();
                setStations(data);
                console.log(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStations();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/stations/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error while deleting station");

            setStations((prev) => prev.filter((s) => s._id !== id));
            router.push("/stations");
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const selectedStation = stationId
        ? stations.find((s) => s._id === stationId)
        : null;
    if (stationId && !selectedStation && stations.length > 0) {
        return (
            <main className="m-5">
                <Link
                    href="/stations"
                    className="mb-4 text-blue-600 font-semibold cursor-pointer self-start"
                >
                    Go back to station list
                </Link>
                <p>Station not found</p>
            </main>
        );
    }
    if (stationId && selectedStation) {
        const isOwner = session?.user?.email === selectedStation.createdBy;

        return (
            <main className="m-5 flex flex-col items-center">
                <Link
                    href="/stations"
                    className="text-blue-600 self-start font-semibold mb-4"
                >
                    Go back to station list
                </Link>

                <h1 className="text-3xl mb-3 capitalize">
                    {selectedStation.name}
                </h1>
                <p>Longitude: {selectedStation.lon}</p>
                <p>Latitude: {selectedStation.lat}</p>
                <p>
                    AQI:{" "}
                    <span
                        className="font-semibold"
                        style={{
                            color: getAQILevel(
                                selectedStation.aqiHistory[
                                    selectedStation.aqiHistory.length - 1
                                ].aqi
                            ).color,
                        }}
                    >
                        {
                            selectedStation.aqiHistory[
                                selectedStation.aqiHistory.length - 1
                            ].aqi
                        }
                    </span>
                </p>

                {isOwner && (
                    <button
                        onClick={() => handleDelete(selectedStation._id)}
                        className="mt-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Удалить станцию
                    </button>
                )}

                <section className="mt-6 w-[90%] flex flex-col items-center">
                    <AQIHistoricalChart data={selectedStation} />
                </section>
            </main>
        );
    }
}
