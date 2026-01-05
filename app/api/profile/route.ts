import { NextRequest, NextResponse } from "next/server";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  await initMongoose();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bio, name, username } = await req.json();

  await User.findByIdAndUpdate(session.user.id, { bio, name, username });

  return NextResponse.json({ status: "ok" });
}