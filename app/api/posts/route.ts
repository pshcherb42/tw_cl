import { initMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Post from "@/models/Post"
import "@/models/User"
import { NextRequest, NextResponse } from "next/server";
import Like from "@/models/Like";
import { Session } from "inspector/promises";
import Follower from "@/models/Follower";

export async function POST(req:NextRequest) {
    await initMongoose(); // to have connection to our database
    const session = await getServerSession(authOptions); // session info to get user id
    // now we create a model for post 

    const {text,parent,images} = await req.json();
    const post = await Post.create({
        author:session.user.id,
        text,
        parent,
        images,
    });
    if (parent) {
        const parentPost = await Post.findById(parent);
        parentPost.commentsCount = await Post.countDocuments({parent});
        await parentPost.save();
    }
    return NextResponse.json(post);
}

export async function GET(req: NextRequest) {
    await initMongoose();
    const session = await getServerSession(authOptions);
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
        const post = await Post.findById(id)
        .populate('author')
        .populate({
           path: 'parent', 
           populate: 'author',
        });
        return NextResponse.json(post);
    } else {
        const parent = req.nextUrl.searchParams.get("parent") || null;
        const author = req.nextUrl.searchParams.get("author");
        let searchFilter;
        if (!author && !parent) {
            const myFollows = await Follower.find({source:session.user.id}).exec();
            const idsOfPeopleIFollow = myFollows.map(f => f.destination);
            searchFilter = {author:[...idsOfPeopleIFollow,session.user.id]}
        }
        if (author) {
            searchFilter = {author};
        }
        if (parent) {
            searchFilter = {parent};
        }
        const posts = await Post.find(searchFilter)
        .populate('author') // to retrieve image and nickname for user
        .populate({
            path: 'parent',
            populate: 'author',
        })
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
