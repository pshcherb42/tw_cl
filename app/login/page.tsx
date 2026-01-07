"use client"

import { useEffect, useState } from "react";
import {getProviders, signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const [providers, setProviders] = useState<any>(null);
  const {data,status} = useSession();
  const router = useRouter();


  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  if (status === 'loading') {
    return '';
  }
  if (data) {
    router.push('/');
  }
  return (
    <div className="flex items-center justify-center h-screen">
      {providers && Object.values(providers).map((provider: any) => (
        <div key={provider.id}>
          <button onClick={async () => {await signIn(provider.id)}} className="bg-twitter-white pl-3 pr-5 py-2 text-black rounded-full flex items-center">
            <img src="/google.png" alt="" className="h-8"/>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

/*export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {providers},
  }
}*/


