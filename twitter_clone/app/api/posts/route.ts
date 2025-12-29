import { initMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Post from "@/models/Post"
import { NextRequest, NextResponse } from "next/server";
import Like from "@/models/Like";
import { Session } from "inspector/promises";

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
    const session = await getServerSession(authOptions);
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
        const post = await Post.findById(id).populate('author');
        return NextResponse.json(post);
    } else {
        const posts = await Post.find()
        .populate('author') // to retrieve image and nickname for user
        .sort({createdAt: -1}) // to sort in descending order
        .limit(20)
        .exec();
        const postsLikedByMe = await Like.find({
            author:session.user.id,
            post:posts.map(p => p._id),
        })
        const idsLikedByMe = postsLikedByMe.map(like => like.post);
        return NextResponse.json({
            posts,
            idsLikedByMe,
        });
    }
}
