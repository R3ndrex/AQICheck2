import { connectToDB } from "../../../lib/mongodb.js";
import Station from "../../../models/station.js";

export async function POST(req) {
    const body = await req.json();

    await connectToDB();
    const newStation = await Station.create(body);

    return Response.json({ success: true, station: newStation });
}
export async function GET() {
    try {
        await connectToDB();
        const stations = await Station.find({});
        return Response.json(stations);
    } catch (error) {
        console.error("Error fetching stations:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch stations" }),
            { status: 500 }
        );
    }
}
