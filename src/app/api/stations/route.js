import { connectToDB } from "../../../lib/mongodb.js";
import Station from "../../../models/station.js";

export async function POST(req) {
    try {
        console.log("POST /api/stations: Received request");
        let body;
        try {
            body = await req.json();
            console.log("Request body:", body);
        } catch (error) {
            console.error("Error parsing request body:", error);
            return new Response(
                JSON.stringify({ error: "Invalid request body" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        if (!body.name) {
            console.error("Missing required field: name");
            return new Response(
                JSON.stringify({ error: "Station name is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        console.log(body);
        const aqi = body.aqi | 0;

        console.log("Connecting to database...");
        await connectToDB();
        console.log("Connected to database");

        const existingStation = await Station.findOne({ name: body.name });

        if (existingStation) {
            console.log(
                `Station with name "${body.name}" already exists. Updating aqi...`
            );

            const updatedStation = await Station.findOneAndUpdate(
                { name: body.name },
                { aqi: aqi },
                { new: true }
            );

            console.log("Station updated:", updatedStation);

            return new Response(
                JSON.stringify({
                    success: true,
                    station: updatedStation,
                    message: "Station updated",
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        } else {
            console.log("Creating new station...");
            const newStation = await Station.create({
                name: body.name,
                latitude: body.latitude || 0,
                longitude: body.longitude || 0,
                aqi: aqi,
            });

            console.log("New station created:", newStation);

            return new Response(
                JSON.stringify({ success: true, station: newStation }),
                {
                    status: 201,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    } catch (error) {
        console.error("Error saving station:", error);

        return new Response(
            JSON.stringify({
                error: "Failed to save station",
                message: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
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
