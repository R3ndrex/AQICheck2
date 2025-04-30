"use client";
import { useEffect, useState } from "react";

export default function StationList() {
    const [stations, setStations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStations() {
            try {
                const res = await fetch("/api/stations");
                if (!res.ok) throw new Error("Ошибка при загрузке");
                const data = await res.json();
                setStations(data);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchStations();
    }, []);

    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div className="flex flex-col gap-3 m-5">
            <h2 className="text-2xl">Список станций</h2>
            {stations.length === 0 && <p>Нет станций</p>}
            <ul className="list-disc pl-5">
                {stations.map((station) => (
                    <li key={station._id}>
                        {station.name} — {station.latitude}, {station.longitude}
                    </li>
                ))}
            </ul>
        </div>
    );
}
