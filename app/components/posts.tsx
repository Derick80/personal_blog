import Tooltip from "~/components/shared/tooltip";
import { Link } from "@remix-run/react";
import Icon from "~/components/shared/icon";
import CategoryContainer from "~/components/category-container";
import Sectionheader from "./shared/section-header";
import { format } from "date-fns";
import LikeContainer from "./like-container";

type PostsProps = {
  posts: {
    _count: {
      likes: number;
      comments: number;
    };
    id: string;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    postImg: string;
    likes: Array<{
      id: string;
      userId: string;
      postId: string;
    }>;
    categories: Array<{ id: string; name: string }>;
  };
  userId: string;
  isOwner: boolean;
  isPost: boolean;
};
export default function Posts({ posts, isOwner, isPost, userId }: PostsProps) {
  const likeArray = [
    {
      id: "1",
      userId: "1",
      postId: "1",
    },
    {
      id: "2",
      userId: "2",
      postId: "1",
    },
  ];
  return (
    <div key={posts.id}>
      <Sectionheader>{posts.title}</Sectionheader>
      <hr />

      <CategoryContainer categories={posts.categories} isPost={isPost} />
      <hr />

      <div>
        <img
          style={{
            backgroundSize: "cover",
            ...(posts.postImg
              ? { backgroundImage: `url(${posts.postImg})` }
              : {}),
          }}
          src={posts.postImg}
          alt="profile"
        />
        <div>{posts.body}</div>
      </div>
      <div className="text-m-p-sm md:text-d-psm">
        {" "}
        {format(new Date(posts.createdAt), "MMMM do, yyyy")}
      </div>
      <div>
        {posts?._count.likes ? <>{posts._count.likes}</> : <>no likes yet</>}
      </div>
      <LikeContainer postId={posts.id} likes={likeArray} currentUser={userId} />

      {isOwner ? (
        <div className="flex flex-row justify-end">
          <Tooltip message="Edit Post">
            <Link to={`/${posts.id}`} className="dark:text-white font-semibold">
              EDIT
            </Link>
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
}
