import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import Link from "next/link"
import PostButtons from "@/components/PostButtons"

export default function PostContent({
  text,author,
  createdAt,likesCount,commentsCount,
  likedByMe,_id,big = false}) {
    return (
        <div>
          <div className="flex w-full"> 
            <div>
             {!!author?.image && (
              <Link href={`/`+author?.username}>
                <div className="cursor-pointer">
                  <Avatar src={author.image} />
                </div>
              </Link>
             )}
            </div>
            <div className="pl-2 grow">
              <div>
                <Link href={`/`+author?.username}>
                  <span className="font-bold pr-1 cursor-pointer">{author.name}</span>
                </Link>
                {big && (<br />)}
                <Link href={`/`+author?.username}>
                  <span className=" text-twitter-light-grey cursor-pointer">@{author.username}</span>
                </Link>
                {createdAt && !big && (
                  <span className="pl-1 text-twitter-light-grey">
                    <ReactTimeAgo date={createdAt} timeStyle={'twitter'}/>
                  </span>
                )}
              </div>
              {!big && (
                <div>
                  <Link href={`/${author.username}/status/${_id}`}>
                    <div className="w-full cursor-pointer">{text}</div>
                  </Link>
                  <PostButtons username={author.username} id={_id} likesCount={likesCount} likedByMe={likedByMe} commentsCount={commentsCount}/>
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
              <PostButtons username={author.username} id={_id} likesCount={likesCount} likedByMe={likedByMe} commentsCount={commentsCount}/>
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
// we pass id for postbuttons to use for counting likes