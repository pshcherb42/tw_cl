"use client"
import Layout from "@/components/Layout";
import TopNavLink from "@/components/TopNavigatioLink";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cover from "@/components/Cover"
import Avatar from "@/components/Avatar";
import PostContent from "@/components/PostContent";

export default function UserPage() {
  const params = useParams();  
  const username = params.username;
  const [profileInfo,setProfileInfo] = useState();
  const [posts,setPosts] = useState([]);
  const [postsLikedByMe,setPostsLikedByMe] = useState([]);

useEffect(() => {
  if (!username) {
    return;
  }
  axios.get('/api/users?username='+username)
    .then(response => {
      setProfileInfo(response.data.user);
    })
},[username]);

useEffect(() => {
  if(!profileInfo?._id) {
    return;
  } 
  axios.get('/api/posts?author='+profileInfo._id)
    .then(response => {
      setPosts(response.data.posts);
      setPostsLikedByMe(response.data.idsLikedByMe);
    })
}, [profileInfo])

  return (
      <Layout>
        {!!profileInfo && (
          <div>
            <div className="px-5 pt-2">
                <TopNavLink title={profileInfo.name} />
            </div>
            <Cover />
            <div className="flex justify-between">
              <div className="ml-5 relative">
                <div className="absolute -top-12 border-4 rounded-full border-black">
                  <Avatar big src={profileInfo.image}/>
                </div>
                 
              </div>
              <div className="p-2">
                <button className="bg-twitter-blue text-white py-2 px-5 rounded-full">Follow</button>
              </div>
            </div>
            <div className="px-5 pt-2">
              <h1 className="fontbold text-xl leading-5">{profileInfo.name}</h1>
              <h2 className="text-twitter-light-grey text-sm">@{profileInfo.username}</h2>
              <div className="text-sm mt-2 mb-2">
                mars an dcars
              </div>
            </div>
          </div>
        )}
        {posts?.length > 0 && posts.map(post => (
          <div className="p-5 border-t border-twitter-border" key={post._id}>
            <PostContent {...post} likedByMe={postsLikedByMe.includes(post._id)} />
          </div>
        ))}
      </Layout>
    );
}