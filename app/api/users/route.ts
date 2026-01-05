import { NextRequest, NextResponse } from "next/server";
import {initMongoose} from "../../../lib/mongoose";
import User from "../../../models/User"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Follower from "@/models/Follower"

export async function GET(req: NextRequest) {
    await initMongoose();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const username = searchParams.get("username");
    const session = await getServerSession(authOptions);

    let user = null;
    if (id) {
    user = await User.findById(id);
    } else if (username) {
    user = await User.findOne({ username });
    }
    const follow = await Follower.findOne({
        source:session.user.id,
        destination:user._id
    });
    return NextResponse.json({user, follow});
}

export async function PUT(req: NextRequest) {
    await initMongoose();
    const session = await getServerSession(authOptions);
    const {username} = await req.json();
    await User.findByIdAndUpdate(session.user.id, {username});
    return NextResponse.json('ok');
}