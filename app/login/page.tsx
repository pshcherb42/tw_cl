"use client"
import { useEffect, useState } from "react"
import { getProviders, signIn, useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

// Login.tsx
export default function Login() {
  const [providers, setProviders] = useState<any>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    }
    fetchProviders();
  }, []);

  // ✅ Wrap redirect in useEffect with empty deps
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]); // ❌ Empty array - only runs ONCE

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (session) {
    return null; // Don't show login form while redirecting
  }

  const handleSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: "/" });
  };


  return (
    <div className="flex items-center justify-center h-screen">
      {providers && Object.values(providers).map((provider: any) => (
        <div key={provider.id}>
          <button 
            onClick={() => handleSignIn(provider.id)} 
            className="bg-twitter-white px-5 py-4 text-black rounded-full flex items-center gap-2"
          >
            <img src="/google.png" alt="Google" width={28} height={28} />
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}


