import { NextRequest, NextResponse } from "next/server";
import {initMongoose} from "../../../lib/mongoose";
import User from "../../../models/User"

export async function GET(req: NextRequest) {
    await initMongoose();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const user = await User.findById(id);

    return NextResponse.json({user});
}