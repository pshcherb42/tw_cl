import useUserInfo from "@/hooks/useUserInfo";
import { useState } from "react";
import axios from "axios";


export default function PostForm() {
    const {userInfo, status} = useUserInfo();
    const [text, setText] = useState('');
    async function  handlePostSubmit(e) {
        e.preventDefault();
        await axios.post('/api/posts', {text})
    }

    if (status === 'loading') { // in case we dont have a user information
        return '';
    }
    return (
        <form className="mx-5" onSubmit={handlePostSubmit}>
        <div className="flex">
          <div>
            <div className="rounded-full overflow-hidden w-12">
              <img src={userInfo?.image} alt="avatar"/>
            </div>
          </div>
          <div className="grow pl-2">
            <textarea className="w-full p-2 bg-transparent text-twitter-white"
                      value={text}
                      onChange={e => setText(e.target.value)}
                      placeholder="What's happening?"/>
            <div className="text-right border-t border-twitter-border pt-2">
              <button className="bg-twitter-blue text-white px-5 py-2 rounded-full">Tweet</button>
            </div>
          </div>
        </div>
      </form>
    );
}