import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import Link from "next/link"
import PostButtons from "@/components/PostButtons"

export default function PostContent({text,author,createdAt,_id,big}) {
    return (
        <div>
          <div className="flex w-full"> 
            <div>
              <Avatar src={author.image} />
            </div>
            <div className="pl-2 grow">
              <div>
                <span className="font-bold pr-1">{author.name}</span>
                {big && (<br />)}
                <span className=" text-twitter-light-grey">@{author.username}</span>
                {createdAt && !big && (
                  <span className="pl-1 text-twitter-light-grey">
                    <ReactTimeAgo date={createdAt} timeStyle={'twitter'}/>
                  </span>
                )}
              </div>
              {!big && (
                <div>
                  <Link href={`/${author.username}/status/${_id}`}>
                    {text}
                  </Link>
                  <PostButtons />
                </div>
              )}
            </div>
          </div>
          {big && (
            <div className="mt-2">
              <Link href={`/${author.username}/status/${_id}`}>
                {text}
              </Link>
              {createdAt && (
                <div className="text-twitter-light-grey text-sm">
                  {(new Date(createdAt))
                    .toISOString()
                    .replace('T', ' ')
                    .slice(0,16)
                    .split(' ')
                    .reverse()
                    .join(' ')}
                </div>
              )}
              <PostButtons />
            </div>
          )}
        </div>  
    );
}

// flex to divide in two columns
// first div have avatar, second one has text
// we use Avatar to render user image 
// use span too add spacing
// we use react-time-ago to calculate time passed since the post is posted, we save it inside providers.tsx
// we use <link> to redirect from main page to specific twitter page on click(use backticks instead of quotes for href)
// app/[username]/status/[id] to acces twitter page
// big for different kind of display