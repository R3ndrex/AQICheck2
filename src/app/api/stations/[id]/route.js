import { connectToDB } from "@/lib/mongodb";
import Station from "@/models/station";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req, { params }) {
    await connectToDB();
    try {
        const { id } = await params;
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

        if (!Array.isArray(station.aqiHistory)) {
            station.aqiHistory = [];
        }
        station.aqiHistory.push({ aqi: aqi, date: new Date() });
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
export async function DELETE(req, { params }) {
    await connectToDB();

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const station = await Station.findById(id);

        if (!station) {
            return NextResponse.json(
                { error: "Station not found" },
                { status: 404 }
            );
        }

        if (station.createdBy !== session.user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await Station.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Station deleted" });
    } catch (error) {
        console.error("Error in DELETE /stations/[id]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
