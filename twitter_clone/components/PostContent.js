import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import Link from "next/link"

export default function PostContent({text,author,createdAt,_id}) {
    return (
        <div className="flex"> 
            <div>
              <Avatar src={author.image} />
            </div>
            <div className="pl-2">
              <div>
                <span className="font-bold">{author.name}</span>
                <span className="pl-1 text-twitter-light-grey">@{author.username}</span>
                {createdAt && (
                  <span className="pl-1 text-twitter-light-grey">
                    <ReactTimeAgo date={createdAt} timeStyle={'twitter'}/>
                  </span>
                )}
              </div>
              <Link href={`/${author.username}/status/${_id}`}>
                {text}
              </Link>
            </div>
        </div>
    )
}

// flex to divide in two columns
// first div have avatar, second one has text
// we use Avatar to render user image 
// use span too add spacing
// we use react-time-ago to calculate time passed since the post is posted, we save it inside providers.tsx
// we use <link> to redirect from main page to specific twitter page on click(use backticks instead of quotes for href)