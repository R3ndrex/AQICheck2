"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AQIHistoricalChart from "../AQIHistoricalChart";
import { getAQILevel } from "@/app/map/AQILegend";
export default function StationsPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session } = useSession();
    const stationIndex = parseInt(params?.id); // теперь это индекс, а не _id

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

    const selectedStation =
        stationIndex >= 0 && stationIndex < stations.length
            ? stations[stationIndex]
            : null;

    if (selectedStation) {
        const isOwner = session?.user?.email === selectedStation.createdBy;

        return (
            <main className="m-5 flex flex-col items-center">
                <Link
                    href="/stations"
                    className="text-blue-600 font-semibold self-start mb-4"
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
                    <h1 className="text-xl mb-2">
                        Station ID: {selectedStation._id}
                    </h1>
                )}
                {isOwner && (
                    <button
                        onClick={() => handleDelete(selectedStation._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete station
                    </button>
                )}
                <section className="mt-6 w-[90%] flex flex-col items-center">
                    <AQIHistoricalChart data={selectedStation} />
                </section>
            </main>
        );
    }

    return (
        <main className="m-5">
            <Link
                href="/stations"
                className="text-blue-600 font-semibold mb-4 block"
            >
                Go back to station list
            </Link>
            <p>Station not found</p>
        </main>
    );
}
