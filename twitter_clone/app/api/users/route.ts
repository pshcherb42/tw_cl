import { NextRequest, NextResponse } from "next/server";
import {initMongoose} from "../../../lib/mongoose";
import User from "../../../models/User"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    await initMongoose();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const user = await User.findById(id);

    return NextResponse.json({user});
}

export async function PUT(req: NextRequest) {
    await initMongoose();
    const session = await getServerSession(authOptions);
    const {username} = await req.json();
    await User.findByIdAndUpdate(session.user.id, {username});
    return NextResponse.json('ok');
}