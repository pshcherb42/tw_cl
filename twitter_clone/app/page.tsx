"use client"
import useUserInfo from "@/hooks/useUserInfo";
import UsernameFrom from "@/components/UsernameForm";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export default function Home() {

  
  const {userInfo, status:userInfoStatus} = useUserInfo();


  if (userInfoStatus === 1) {
    return 'loading user info';
  }

  if (!userInfo?.username) {
    return <UsernameFrom />;
  }

  return (
    <div>Homepage logged in {userInfo.username}</div>
  )
}

