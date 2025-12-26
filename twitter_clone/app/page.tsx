"use client"
import useUserInfo from "@/hooks/useUserInfo";
import UsernameFrom from "@/components/UsernameForm";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostForm from "@/components/PostForm";
import axios from "axios";
export default function Home() {

  
  const {userInfo, status:userInfoStatus} = useUserInfo();
  const [posts,setPosts] = useState([]);

  function fetchHomePosts() {
    axios.get('/api/posts').then(Response => {
      setPosts(Response.data);
    });
  }

  useEffect(() => {
    fetchHomePosts();
  }, []);

  if (userInfoStatus === 1) {
    return 'loading user info';
  }

  if (!userInfo?.username) {
    return <UsernameFrom />;
  }

  return (
    <div className="max-w-lg mx-auto border-l border-r border-twitter-border min-h-screen">
      <h1 className="text-lg font-bold p-4">Home</h1>
        <PostForm/>
        <div className="">
          {posts.length}
        </div>
    </div>
  )
}

