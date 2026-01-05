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
import TopNavLink from "@/components/TopNavigatioLink"

export default function PostPage() {
    const params = useParams();
    const {id} = params;
    const [post,setPost] = useState<any>();
    const {userInfo} = useUserInfo();
    const [replies,setReplies] = useState<any[]>([]);
    const [repliesLikedByMe,setRepliesLikedByMe] = useState<any[]>([]);

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
                  <TopNavLink/>
                  {post.parent && (
                    <div className="pb-1">
                      <PostContent {...post.parent}/>
                      <div className=" ml-5 h-16 relative">
                         <div className="h-21 border-l-2 border-twitter-border absolute -top-5" 
                              style={{marginLeft:'2px'}}></div>
                      </div>
                    </div>
                  )}
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