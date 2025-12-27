import { initMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Post from "@/models/Post"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    await initMongoose(); // to have connection to our database
    const session = await getServerSession(authOptions); // session info to get user id
    // now we create a model for post 

    const {text} = await req.json();
    const post = await Post.create({
        author:session.user.id,
        text,
    });
    return NextResponse.json(post);
}

export async function GET(req: NextRequest) {
    await initMongoose();
    const posts = await Post.find()
    .populate('author') // to retrieve image and nickname for user
    .sort({createdAt: -1}) // to sort in descending order
    .exec();
    return NextResponse.json(posts);
}
