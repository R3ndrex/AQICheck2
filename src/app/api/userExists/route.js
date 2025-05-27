import { NextResponse } from "next/server.js";
import { connectToDB } from "../../../lib/mongodb.js";
import User from "../../../models/user.js";
export async function POST(req) {
    try {
        await connectToDB();
        const { email } = await req.json();
        const user = await User.findOne({ email }).select("_id");
        console.log(`User: ${user}`);
        return NextResponse.json({ user });
    } catch (e) {
        console.error(e);
    }
}
