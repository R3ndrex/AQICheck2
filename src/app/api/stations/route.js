import { connectToDB } from "../../../lib/mongodb.js";
import Station from "../../../models/station.js";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        console.log(session);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const body = await req.json();

        if (!body.name) {
            return new Response(
                JSON.stringify({ error: "Station name is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const aqi = Number(body.aqi) || 0;

        await connectToDB();

        const existingStation = await Station.findOne({ name: body.name });

        if (existingStation) {
            existingStation.aqiHistory.push({ aqi, recordedAt: new Date() });
            await existingStation.save();

            return new Response(
                JSON.stringify({
                    success: true,
                    station: existingStation,
                    message: "AQI updated and added to history",
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } else {
            const newStation = await Station.create({
                name: body.name,
                lat: body.lat || 0,
                lon: body.lon || 0,
                aqi: aqi,
                aqiHistory: [{ aqi, recordedAt: new Date() }],
                createdBy: session.user.email,
            });

            return new Response(
                JSON.stringify({ success: true, station: newStation }),
                { status: 201, headers: { "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Failed to save station",
                message: error.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function GET(req) {
    try {
        console.log("GET /api/stations: Received request");

        console.log("Connecting to database...");
        await connectToDB();
        console.log("Connected to database");

        const stations = await Station.find({});
        console.log(`Found ${stations.length} stations`);

        return new Response(JSON.stringify(stations), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching stations:", error);

        return new Response(
            JSON.stringify({
                error: "Failed to fetch stations",
                message: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
