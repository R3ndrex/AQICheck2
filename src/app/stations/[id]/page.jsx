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
    const [newAQI, setNewAQI] = useState();
    const stationIndex = parseInt(params?.id);

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

    async function handleDelete(id) {
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
    }

    async function handleUpdateAQI() {
        try {
            const stationId = selectedStation._id;
            const res = await fetch(`/api/stations/${stationId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ aqi: parseInt(newAQI) }),
            });

            if (!res.ok) throw new Error("Failed to update AQI");

            const updatedData = await res.json();
            setStations((prev) =>
                prev.map((s) => (s._id === stationId ? updatedData.station : s))
            );
            setNewAQI("");
        } catch (err) {
            alert("Error updating AQI: " + err.message);
        }
    }
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
                <div>
                    <h1 className="flex gap-5 items-center mb-4">
                        <span className="text-3xl capitalize">
                            {selectedStation.name}
                        </span>
                        {isOwner && (
                            <button
                                onClick={() =>
                                    handleDelete(selectedStation._id)
                                }
                                className="pb-2 pt-2 pl-3 pr-3 text-sm cursor-pointer border-1 bg-red-400"
                            >
                                Delete
                            </button>
                        )}
                    </h1>
                    {isOwner && (
                        <p className="text-xl">
                            Station ID: <b>{selectedStation._id}</b>
                        </p>
                    )}
                    <p className="text-xl">Longitude: {selectedStation.lon}</p>
                    <p className="text-xl">Latitude: {selectedStation.lat}</p>
                    <p className="text-xl">
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
                        <>
                            <div className="flex gap-2 mb-4 mt-4">
                                <input
                                    type="tel"
                                    className="p-1 text-lg placeholder-slate-400"
                                    value={newAQI}
                                    onChange={(e) => setNewAQI(e.target.value)}
                                    placeholder="Enter new AQI"
                                />
                                <button
                                    onClick={handleUpdateAQI}
                                    className="pb-2 pt-2 pl-3 pr-3 cursor-pointer border-1 text-lg bg-emerald-200"
                                >
                                    Update AQI
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <section className="mt-6 w-full flex flex-col items-center">
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
