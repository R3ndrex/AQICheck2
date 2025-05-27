import { connectToDB } from "@/lib/mongodb";
import Station from "@/models/station";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
    await connectToDB();

    try {
        // Нужно получить params так:
        const { id } = await params; // await здесь необходим

        const { aqi } = await req.json();

        if (aqi === undefined || aqi === null) {
            return NextResponse.json(
                { error: "Missing 'aqi'" },
                { status: 400 }
            );
        }

        const station = await Station.findById(id);

        if (!station) {
            return NextResponse.json(
                { error: "Station not found" },
                { status: 404 }
            );
        }

        // Инициализируем массив aqiHistory, если его нет
        if (!Array.isArray(station.aqiHistory)) {
            station.aqiHistory = [];
        }

        // Добавляем в историю новое значение с датой
        station.aqiHistory.push({ aqi: aqi, date: new Date() });

        // Обновляем текущее значение и дату обновления
        station.aqi = aqi;
        station.updatedAt = new Date();

        await station.save();

        return NextResponse.json({ success: true, station });
    } catch (err) {
        console.error("Error in PATCH /stations/[id]:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
