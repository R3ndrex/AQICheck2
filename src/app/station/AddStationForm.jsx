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
                body: JSON.stringify({ name, latitude, longitude, aqi }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error("Ошибка сервера: " + text);
            }

            const result = await res.json();
            setName("");
            setLatitude("");
            setLongitude("");
        } catch (err) {
            alert("Error: " + err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                type="text"
                placeholder="Station name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
            />
            <input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
            />
            <input
                type="number"
                placeholder="AQI"
                value={aqi}
                onChange={(e) => setAqi(e.target.value)}
            />
            <button className="cursor-pointer" type="submit">
                Add station
            </button>
        </form>
    );
}
