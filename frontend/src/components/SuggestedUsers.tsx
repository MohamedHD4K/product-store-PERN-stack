import { LazyLoadImage } from "react-lazy-load-image-component";
import { IoAdd } from "react-icons/io5";
import { MouseEventHandler } from "react";

interface UserData {
  username: string;
  avatar: string;
  email: string;
  fullname: string;
  bio: string;
}

const SuggestedUsers = ({ user , onFollow }: { user: UserData ; onFollow : MouseEventHandler<HTMLButtonElement> }) => {
  if (!user) return <p>No user data available</p>;

  return (
    <div className="flex justify-between items-center gap-3 p-4 hover:bg-base-300 rounded-2xl duration-150">
      <LazyLoadImage
        src={user.avatar || "avatar.png"}
        className="rounded-full size-12"
        alt={`${user.username}'s avatar`}
      />
      <div className="flex flex-col flex-1 justify-between p-1">
        <h1 className="line-clamp-1 font-bold">{user.username}</h1>
        <p className="line-clamp-1 text-sm">
          {user.bio ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, obcaecati."}
        </p>
      </div>
      <button onClick={onFollow} className="btn w-7 h-7 p-0 btn-outline rounded-md btn-primary">
        <IoAdd className="size-4" />
      </button>
    </div>
  );
};

export default SuggestedUsers;
