"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PostContent from "@/components/PostContent";
import Layout from "@/components/Layout";
import Link from "next/link";
import useUserInfo from "@/hooks/useUserInfo";
import PostForm from "@/components/PostForm";
import { NextResponse } from "next/server";

export default function PostPage() {
    const params = useParams();
    const {id} = params;
    const [post,setPost] = useState();
    const {userInfo} = useUserInfo();
    const [replies,setReplies] = useState([]);
    const [repliesLikedByMe,setRepliesLikedByMe] = useState([]);

    function fetchData() {
      axios.get('/api/posts?id='+id)
        .then(response => {
            setPost(response.data);
        });
      axios.get('/api/posts?parent='+id)
        .then(response => {
          setReplies(response.data.posts);
          setRepliesLikedByMe(response.data.idsLikedByMe);
        })
    }
    useEffect(() => {
      if (!id) {
        return;
      }
      fetchData();
    }, [id]);

    return (
        <Layout>
            {!!post?._id && (
                <div className="px-5 py-2">
                  <Link href={'/'}>
                    <div className="flex mb-5 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                      Tweet
                    </div>
                  </Link>
                  <PostContent {...post} big />
                  
                </div>  
            )}
            {!!userInfo && (
              <div className="border-t border-twitter-border py-5">
                <PostForm onPost={fetchData}
                          parent={id} 
                          compact placeholder="Tweet your reply"/>
              </div>

            )}
            <div className="">
              {replies.length > 0 && replies.map(reply => (
                <div key={reply._id} className="p-5 border-t border-twitter-border">
                  <PostContent {...reply} likedByMe={repliesLikedByMe.includes(reply._id)}/>
                </div>
              ))}
            </div>
        </Layout>
    );
}

// first we look for id using params(useRouter in page versions)
// after we have params we can find id
// useState and useEffect: what happens when we open page
// we use id to access post (GET)
// after we set post we can use PostContent
// then we create arrow back to Home page from heroicons