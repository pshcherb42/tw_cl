import useUserInfo from "@/hooks/useUserInfo";
import { useState } from "react";
import axios from "axios";
import Avatar from "@/components/Avatar"


export default function PostForm({onPost, compact,parent,placeholder='What\'s happening?'}) { // added onPost property for page to reload on post
    const {userInfo, status} = useUserInfo();
    const [text, setText] = useState('');
    async function  handlePostSubmit(e) {
        e.preventDefault();
        await axios.post('/api/posts', {text,parent});
        setText(''); // clean form after post
        if(onPost) {
          onPost(); // now we go to where we call PostForm
        }
    }

    if (status === 'loading') { // in case we dont have a user information
        return '';
    }
    return (
        <form className="mx-5" onSubmit={handlePostSubmit}>
        <div className={(compact ? 'items-center' : '') + " flex"}>
          <div>
            <Avatar src={userInfo?.image}/>
          </div>
          <div className="grow pl-2">
            <textarea className={(compact ? 'h-10 mt-1' : 'h-24') + " w-full p-2 bg-transparent text-twitter-white"}
                      value={text}
                      onChange={e => setText(e.target.value)}
                      placeholder={placeholder}/>
          {!compact && (
            <div className="text-right border-t border-twitter-border pt-2 pb-2">
              <button className="bg-twitter-blue text-white px-5 py-2 rounded-full">Tweet</button>
            </div>
          )}
          </div>
          {compact && (
            <div className="pl-2">
              <button className="bg-twitter-blue text-white px-5 py-2 rounded-full">Tweet</button>
            </div>
          )}
        </div>
      </form>
    );
}