import { connectToDB } from "@/lib/mongodb";
import Station from "@/models/station";
import { NextResponse } from "next/server";
export async function PATCH(req, { params }) {
    await connectToDB();

    try {
        const { id } = await params;

        const { aqi } = await req.json();

        if (!aqi && aqi !== 0) {
            return NextResponse.json(
                { error: "Missing 'aqi'" },
                { status: 400 }
            );
        }

        const updated = await Station.findByIdAndUpdate(
            id,
            { aqi, updatedAt: new Date() },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { error: "Station not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, station: updated });
    } catch (err) {
        console.error("Error in PATCH /stations/[id]:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
