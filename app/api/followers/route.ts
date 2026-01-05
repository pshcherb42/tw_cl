import { NextRequest, NextResponse } from "next/server";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Follower from "@/models/Follower";

export const runtime = "nodejs";

export async function POST(req:NextRequest) {
  await initMongoose();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { destination } = await req.json();

  const existingFollow = await Follower.findOne({
    destination,
    source: session.user.id,
  });

  if (existingFollow) {
    await existingFollow.deleteOne();
    return NextResponse.json(null);
  } else {
    const f = await Follower.create({ destination, source: session.user.id });
    return NextResponse.json(f);
  }
}