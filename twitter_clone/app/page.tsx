"use client"
import useUserInfo from "@/hooks/useUserInfo";
import UsernameFrom from "@/components/UsernameForm";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostForm from "@/components/PostForm";
import PostContent from "@/components/PostContent";
import axios from "axios";
import Layout from "@/components/Layout"
export default function Home() {

  
  const {userInfo, status:userInfoStatus} = useUserInfo();
  const [posts,setPosts] = useState<any>([]);
  
  function fetchHomePosts() {
    axios.get('/api/posts').then(response => {
      setPosts(response.data);
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
    <Layout>
      <h1 className="text-lg font-bold p-4">Home</h1>
        <PostForm onPost={() => {fetchHomePosts();}}/> 
        <div className=""> 
          {posts.length > 0 && posts.map(post => ( 
            <div className="border-t border-twitter-border p-5">
              <PostContent {...post}/> 
            </div>
          ))}
        </div>
    </Layout>
  )
}

