import { NextResponse } from "next/server.js";
import { connectToDB } from "../../../lib/mongodb.js";
import User from "../../../models/user.js";
import bcrypt from "bcryptjs";
export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        await connectToDB();
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        return NextResponse.json(
            { message: `user ${name} registered` },
            { status: 201 }
        );
    } catch (e) {
        return NextResponse.json(
            {
                message: "An error occured while registering user",
            },
            { status: 500 }
        );
    }
}
