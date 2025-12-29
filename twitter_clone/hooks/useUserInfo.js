import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
export default function useUserInfo() {

    const {data: session, status:sessionStatus} = useSession();
    const [userInfo, setUserInfo] = useState(null);
    const [status, setStatus] = useState(1);
    
    function getUserInfo() {
    if (sessionStatus === 'loading') {
            setStatus('loading');
            return;
    }
    if (!session || !session.user || !session.user.id) {
        setUserInfo(null);
        setStatus('unauthenticated');
        return;
    }
    fetch('/api/users?id='+session.user.id)
        .then(Response => {
        Response.json().then(json => {
            setUserInfo(json.user);
            setStatus( 'authenticated' );
        })
        })
    }

    useEffect(() => {
      getUserInfo();
    }, [sessionStatus, session]);

    return {userInfo,setUserInfo, status};
}