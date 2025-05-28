"use client";
import { useState } from "react";

export default function AddStationForm() {
    const [name, setName] = useState("");
    const [aqi, setAqi] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch("/api/stations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    lat: latitude,
                    lon: longitude,
                    aqi,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error("Server error: " + text);
            }

            const result = await res.json();
            setName("");
            setLatitude("");
            setLongitude("");
            setAqi("");
        } catch (err) {
            alert("Error: " + err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex m-5 flex-col gap-3">
            <h1 className="text-2xl mb-4">Create Station</h1>
            <input
                type="text"
                placeholder="Station name"
                className="placeholder-slate-400 p-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="tel"
                className="placeholder-slate-400 p-1"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
            />
            <input
                type="tel"
                className="placeholder-slate-400 p-1"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
            />
            <input
                type="tel"
                className="placeholder-slate-400 p-1"
                placeholder="AQI"
                value={aqi}
                onChange={(e) => setAqi(e.target.value)}
            />
            <button
                className="pb-2 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-emerald-200"
                type="submit"
            >
                Add station
            </button>
        </form>
    );
}
