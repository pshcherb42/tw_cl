"use client"

import { useEffect, useState } from "react"
import { getProviders, signIn, useSession } from "next-auth/react"
import Image from "next/image"

export default function Login() {
    const [providers, setProviders] = useState<any>(null);
    
    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            console.log("Providers:", res);  // Debug log
            setProviders(res);
        }
        fetchProviders();
    }, []);

    const {data: session, status} = useSession();
    console.log("Session:", session);
    console.log("User ID:", (session?.user as any)?.id);  // This shows the ID
    console.log("Status:", status);

    const handleSignIn = (providerId: string) => {
        console.log("Signing in with:", providerId);  // Debug log
        signIn(providerId, { callbackUrl: "/" });
    };

    return (
        <div className="flex items-center justify-center h-screen">
            
            {providers && Object.values(providers).map((provider: any) => (
              <div key={provider.id}>
                <button 
                  onClick={() => handleSignIn(provider.id)} 
                  className="bg-twitter-white px-5 py-2 text-black rounded-full flex items-center gap-2"
                >
                  <div className=" rounded-full p-2">
                    <Image
                      src="/google.png" 
                      alt="Google" 
                      width={24}
                      height={24}
                    />
                  </div>
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
        </div>
    );
}


