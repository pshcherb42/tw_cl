"use client"
import useUserInfo from "@/hooks/useUserInfo";
import UsernameFrom from "@/components/UsernameForm";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostForm from "@/components/PostForm";
import PostContent from "@/components/PostContent";
import axios from "axios";
import Layout from "@/components/Layout"
import { useRouter } from "next/navigation";
export default function Home() {

  const {data:session} = useSession();
  const {userInfo,setUserInfo, status:userInfoStatus} = useUserInfo();
  const [posts,setPosts] = useState<any[]>([]);
  const [idsLikedByMe,setIdsLikedByMe] = useState<any[]>([]);
  const router = useRouter();
  
  function fetchHomePosts() {
    axios.get('/api/posts').then(response => {
      setPosts(response.data.posts);
      setIdsLikedByMe(response.data.idsLikedByMe);
    });
  }

  async function logout() {
    setUserInfo(null);
    await signOut(); // ✅ Properly sign out
  }

  useEffect(() => {
      fetchHomePosts();
  }, []);

  if ((userInfoStatus as any) === 'loading') {
    return 'loading user info';
  }

  if (userInfo && !(userInfo as any)?.username) {
    return <UsernameFrom />;
  }

  if (!userInfo) {
    console.log({session});
    router.push('/login');
    return 'no user info';
  }

  return (
    <Layout>
      <h1 className="text-lg font-bold p-4">Home</h1>
        <PostForm onPost={() => fetchHomePosts()} compact={false} parent={null} />
        <div className=""> 
          {posts.length > 0 && posts.map((post:any) => ( 
            <div key={post._id} className="border-t border-twitter-border p-5">
              {post.parent && (
                <div>
                  <PostContent {...post.parent} />
                  <div className="relative h-8">
                    <div className="border-l-2 border-twitter-border h-10 absolute ml-6 -top-4"></div>
                  </div>
                </div>
              )}
              <PostContent {...post} likedByMe={idsLikedByMe.includes(post._id)}/> 
            </div>
          ))}
        </div>
        {userInfo && (
          <div className="p-5 text-center border-t border-twitter-border">
            <button onClick={logout} className="bg-twitter-white text-black px-5 py-2 rounded-full">
              Logout
            </button>
          </div>
        )}
    </Layout>
  )
}

