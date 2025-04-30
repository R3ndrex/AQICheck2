"use client";
import { useEffect, useState } from "react";

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
        <div className="flex flex-col gap-3 m-5">
            <h2 className="text-2xl">Station List</h2>
            {stations.length === 0 && <p>No stations</p>}
            <ul className="">
                {stations.map((station) => (
                    <li key={station._id}>
                        <h2 className="capitalize">{station.name}</h2>
                        <span>
                            {station.latitude}, {station.longitude}
                        </span>
                        <br />
                        AQI: <span>{station.aqi}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
