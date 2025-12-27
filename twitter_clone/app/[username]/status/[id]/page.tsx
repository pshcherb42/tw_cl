"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PostContent from "@/components/PostContent";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function PostPage() {
    const params = useParams();
    const {id} = params;
    const [post,setPost] = useState();

    useEffect(() => {
      if (!id) {
        return;
      }
      axios.get('/api/posts?id='+id)
        .then(response => {
            setPost(response.data);
        });
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
        </Layout>
    );
}

// first we look for id using params(useRouter in page versions)
// after we have params we can find id
// useState and useEffect: what happens when we open page
// we use id to access post (GET)
// after we set post we can use PostContent
// then we create arrow back to Home page from heroicons