import { initMongoose } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Like from "@/models/Like"
import Post from "@/models/Post";

async function updateLikesCount(postId:string) {
    const post = await Post.findById(postId);
    post.likesCount = await Like.countDocuments({post:postId});
    await post.save();
}

export async function POST(req:NextRequest) {
    await initMongoose();
    const session = await getServerSession(authOptions);

    const body = await req.json(); // Parse JSON body
    const postId = body.id; // finding the post
    const userId = session.user.id;
    const existingLike = await Like.findOne({author:userId,post:postId}); // updating the like number
    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id }); // remove from likes collection
        await updateLikesCount(postId); // update likescount
        return NextResponse.json(null);
    } else {
        const like = await Like.create({author:userId,post:postId});
        await updateLikesCount(postId);
        return NextResponse.json({like});
    }
   
}

// first we need to find id of the post
// we need to compare postid to userid to count likes, for this we create new likes model