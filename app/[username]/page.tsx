"use client"
import Layout from "@/components/Layout";
import TopNavLink from "@/components/TopNavigatioLink";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cover from "@/components/Cover"
import Avatar from "@/components/Avatar";
import PostContent from "@/components/PostContent";
import { userInfo } from "os";
import useUserInfo from "@/hooks/useUserInfo";

export default function UserPage() {
  const params = useParams();  
  const username = params.username;
  const [profileInfo,setProfileInfo] = useState<any>(null);
  const [originalUserInfo,setOriginalUserInfo] = useState();
  const {userInfo} = useUserInfo();
  const [posts,setPosts] = useState<any[]>([]);
  const [postsLikedByMe,setPostsLikedByMe] = useState<any[]>([]);
  const [editMode,setEditMode] = useState(false);
  const [isFollowing,setIsFollowing] = useState(false);

useEffect(() => {
  if (!username) {
    return;
  }
  axios.get('/api/users?username='+username)
    .then(response => {
      setProfileInfo(response.data.user);
      setOriginalUserInfo(response.data.user);
      setIsFollowing(!!response.data.follow);
    })
},[username]);

useEffect(() => {
  if(!(profileInfo as any)?._id) {
    return;
  } 
  axios.get('/api/posts?author='+profileInfo._id)
    .then(response => {
      setPosts(response.data.posts);
      setPostsLikedByMe(response.data.idsLikedByMe);
    })
}, [profileInfo])

function updateUserImage(type:string, src:string) {
  setProfileInfo((prev:any) => ({ ...prev, [type]: src }));
}

async function updateProfile() {
  const {bio,name,username} = profileInfo;
  await axios.put('/api/profile', {
    bio,name,username
  })
  setEditMode(false);
}

const isMyProfile = profileInfo?._id === (userInfo as any)?._id;

function cancel() {
  setProfileInfo((prev:any) => {
    const {bio,name,username} = originalUserInfo as any;
    return {...prev,bio,name,username};
  });
  setEditMode(false);
}

function toggleFollow() {
  setIsFollowing(prev => !prev);
  axios.post('/api/followers',{
    destination: profileInfo?._id,
  })
}

  return (
      <Layout>
        {!!profileInfo && (
          <div>
            <div className="px-5 pt-2">
                <TopNavLink title={profileInfo.name} />
            </div>
            <Cover src={profileInfo.cover}
                   editable={isMyProfile}
                   onChange={(src:any) => updateUserImage('cover',src)}/>
            <div className="flex justify-between">
              <div className="ml-5 relative">
                <div className="absolute -top-12 border-4 rounded-full border-black overflow-hidden">
                  <Avatar big src={profileInfo.image} 
                              editable={isMyProfile} 
                              onChange={(src:any) => updateUserImage('image', src)}
                  />
                </div>
                 
              </div>
              <div className="p-2">
                {!isMyProfile && (
                  <button onClick={toggleFollow} 
                          className={(isFollowing ? 'bg-twitter-white text-black' : 'bg-twitter-blue text-white')+" py-2 px-5 rounded-full"}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
                {isMyProfile && (
                  <div>
                    {!editMode && (
                      <button onClick={() => setEditMode(true)} 
                            className="bg-twitter-blue text-white py-2 px-5 rounded-full">Edit profile</button>
                    )}
                    {editMode && (
                      <div>
                        <button onClick={() => cancel()}
                              className="bg-twitter-white text-black py-2 px-5 rounded-full mr-2"
                        >
                                Cancel
                        </button>

                        <button onClick={() => updateProfile()} 
                              className="bg-twitter-blue text-white py-2 px-5 rounded-full"
                        >
                                Save profile
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 pt-2">
              {!editMode && (
                <h1 className="fontbold text-xl leading-5">{profileInfo.name}</h1>
              )}
              {editMode && (
                <div className="mb-2">
                  <input 
                         type="text" 
                         value={profileInfo.name} 
                         className="bg-twitter-border p-2 rounded-full"
                         onChange={ev => 
                          setProfileInfo((prev:any) => ({
                            ...prev,
                            name:ev.target.value
                          }))
                        }
                  />
                </div>
              )}
              {!editMode && (
                <h2 className="text-twitter-light-grey text-sm">@{profileInfo.username}</h2>
              )} 
              {editMode && (
                <div className="mb-2">
                  <input 
                        type="text" 
                        value={profileInfo.username} 
                        className="bg-twitter-border p-2 rounded-full"
                        onChange={ev => 
                          setProfileInfo((prev:any) => ({
                            ...prev,
                            username:ev.target.value
                          }))
                        }
                  />
                </div>
              )}
              {!editMode && (
                <div className="text-sm mt-2 mb-2">
                  {profileInfo.bio}
                </div>
              )}
              {editMode && (
                <div className="bg-twitter-border p-2 rounded-2xl mb-2">
                  <textarea value={profileInfo.bio}
                            className="w-full block" 
                            onChange={ev => 
                            setProfileInfo((prev:any) => ({
                              ...prev,
                              bio:ev.target.value
                            }))
                          }
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {posts?.length > 0 && posts.map((post: any) => (
          <div className="p-5 border-t border-twitter-border" key={post._id}>
            <PostContent {...post} likedByMe={postsLikedByMe.includes(post._id)} />
          </div>
        ))}
      </Layout>
    );
}