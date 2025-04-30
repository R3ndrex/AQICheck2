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
            alert("Станция добавлена!");
            setName("");
            setLatitude("");
            setLongitude("");
        } catch (err) {
            alert("Ошибка: " + err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                type="text"
                placeholder="Название станции"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Широта"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
            />
            <input
                type="number"
                placeholder="Долгота"
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
                Добавить станцию
            </button>
        </form>
    );
}
