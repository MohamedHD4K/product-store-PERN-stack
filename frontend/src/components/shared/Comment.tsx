const Comment = ({
  username,
  bio,
  avatar,
}: {
  username: string;
  bio: string;
  avatar: string;
}) => {
  return (
    <div className="flex gap-5 p-5">
      <img
        src={avatar ? avatar : "../avatar.png"}
        className="rounded-full lg:w-15 lg:h-15 md:w-13 md:h-13 w-12 h-12"
      />
      <div className="w-full">
        <h1 className="text-start font-medium text-primary lg:text-xl md:text-lg sm:text-md">
          {username}
        </h1>
        <p className="">
          {bio ||
            `Lorem ipsum dolor sit amet consectetur adipisicing elit. ConsequatuLorem ipsum 
              dolor sit amet consectetur adipisicing elit. Consequatur, obcaecatr, obcaecati.`}
        </p>
      </div>
    </div>
  );
};

export default Comment;
