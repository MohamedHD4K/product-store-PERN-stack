import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import SuggestedUsers from "../components/SuggestedUsers";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BsPerson, BsPersonAdd } from "react-icons/bs";
import { MdDescription, MdEmail, MdMoreHoriz } from "react-icons/md";
import Comment from "../components/shared/Comment";
import { BiEdit, BiImageAdd, BiUser } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import Input from "../components/shared/Input";
import { SetStateAction, useState } from "react";

interface UserData {
  username: string;
  avatar: string;
  email: string;
  fullname: string;
  bio: string;
  cover_img: string;
  id: void;
  followinge: number[];
  followers: number[];
}

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState({
    fullname: "",
    username: "",
    email: "",
    avatar: "",
    cover_img: "",
    bio: "",
  });

  const { mutate: followMutate } = useMutation({
    mutationKey: ["users"],
    mutationFn: async (id) => {
      try {
        console.log(id);
        const response = await fetch(
          `http://localhost:3000/api/users/follow/${id}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            method: "PUT",
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "have some errors");

        return data;
      } catch (error) {
        throw new Error(String(error));
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || "User followed successfuly");
      console.log(data.message || "User followed successfuly");
      queryClient.invalidateQueries({ queryKey: ["follow-user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/me", {
          credentials: "include",
          method: "GET",
        });
        const result = await response.json();

        if (result.error) return null;
        if (!response.ok)
          throw new Error(result.error || "Something went wrong");

        return result;
      } catch (error) {
        console.log(error);
        throw new Error(String(error));
      }
    },
    retry: false,
  });

  const { data: suggestUsers, isLoading: isLoadingSuggestedUsers } = useQuery({
    queryKey: ["follow-user"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/suggested",
          { credentials: "include" }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "have some errors");

        return data;
      } catch (error) {
        throw new Error(String(error));
      }
    },
  });

  const {
    mutate: updateMutate,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationKey: ["users"],
    mutationFn: async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/update", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          method: "PUT",
          body: JSON.stringify(value),
        });
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Field fetch update user data");

        return data;
      } catch (error) {
        throw new Error(String(error) || "Field fetch update user data");
      }
    },
    onSuccess: () => {
      toast.success("User data update");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateMutate();
  };

  const handleShowModal = (user: UserData) => {
    setIsModalOpen((prev) => !prev);

    setValue({
      fullname: user.fullname || "",
      username: user.username || "",
      email: user.email || "",
      avatar: user.avatar || "",
      cover_img: user.cover_img || "",
      bio: user.bio || "",
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <p>No user data available</p>;

  return (
    <div className="flex justify-center items-center">
      {isModalOpen && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 w-full h-screen z-30 bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="bg-base-200 popup-animation p-4 px-6 rounded"
          >
            <h3 className="font-bold text-2xl text-primary my-1">
              Edit Profile
            </h3>
            <p className="text-lg pb-1">Edit User Data</p>
            <div className="flex gap-10 my-3 items-center">
              <img
                src={value.avatar || "avatar.png"}
                alt="product image"
                className="object-cover w-80 h-80 rounded-full"
              />
              <div className="flex w-sm flex-col gap-4">
                <Input
                  type="text"
                  label="Full Name"
                  icon={<BiUser size={16} />}
                  placeholder="Enter your fullname"
                  name="fullname"
                  onChange={handleChange}
                  value={value.fullname}
                  required
                />
                <Input
                  type="text"
                  label="Username"
                  icon={<BsPerson size={16} />}
                  placeholder="Enter your username"
                  name="username"
                  onChange={handleChange}
                  value={value.username}
                  required
                />
                <Input
                  type="text"
                  label="Email"
                  icon={<MdEmail size={16} />}
                  placeholder="Enter your email"
                  name="email"
                  onChange={handleChange}
                  value={value.email}
                  required
                />
                <Input
                  type="text"
                  label="Bio"
                  icon={<MdDescription size={16} />}
                  placeholder="Enter your bio"
                  name="bio"
                  onChange={handleChange}
                  value={value.bio}
                  required
                />
                <Input
                  type="url"
                  label="Avatar image"
                  icon={<BiImageAdd size={16} />}
                  placeholder="Enter your avatar image"
                  name="avatar"
                  onChange={handleChange}
                  value={value.avatar}
                  required
                />
                <Input
                  type="url"
                  label="Cover image"
                  icon={<BiImageAdd size={16} />}
                  placeholder="Enter your covar image"
                  name="cover_img"
                  onChange={handleChange}
                  value={value.cover_img}
                  required
                />
              </div>
            </div>
            {isError && <span className="text-red-500">{error.message}</span>}
            <div className="modal-action">
              <button
                onClick={() => setIsModalOpen((prev) => !prev)}
                className="btn btn-error rounded"
              >
                Close
              </button>
              <button type="submit" className="btn btn-success rounded">
                {isPending ? (
                  <span className="loading loading-spinner loading-sm mx-1.5"></span>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="w-7xl my-5 flex gap-5">
        <div className="w-full flex gap-5 flex-col">
          <div className="rounded-2xl bg-base-200">
            <div className="relative h-[22rem]">
              <LazyLoadImage
                src={user.cover_img || "background.png"}
                alt={user.username + "avatar"}
                className="w-full rounded-t-2xl object-cover h-[16rem]"
              />
              <LazyLoadImage
                src={user.avatar || "avatar.png"}
                alt={user.username + "avatar"}
                className="size-35 top-47 left-10 outline-5 outline-base-200 absolute rounded-full object-cover "
              />
            </div>
            <div className="p-10 pt-0 flex flex-col gap-3">
              <h1 className="text-2xl font-bold">{user.fullname}</h1>
              <div>
                <h1 className="text-secondary max-w-[50rem] text-sm">
                  @{user.username}
                </h1>
                <p>{user.email}</p>
              </div>
              <p className="text-secondary max-w-[50rem] text-sm">
                {user.bio ||
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, obcaecati."}
              </p>
              <div className="flex gap-4">
                <button className="flex flex-row items-center gap-1">
                  <span>{user.followinge ? user.followinge.length : 0}</span>
                  <span className="text-sm">Following</span>
                </button>
                <button className="flex flex-row items-center gap-1">
                  <span>{user.followers ? user.followers.length : 0}</span>
                  <span className="text-sm">Followers</span>
                </button>
              </div>
              <div className="flex gap-2">
                {true ? (
                  <button
                    onClick={() => {
                      handleShowModal(user);
                    }}
                    className="btn btn-primary px-10 flex flex-row items-center rounded-md"
                  >
                    <BiEdit size={18} />
                    Edit
                  </button>
                ) : (
                  <button className="btn btn-primary px-10 flex flex-row items-center rounded-md">
                    <BsPersonAdd size={18} />
                    Follow
                  </button>
                )}
                <button className="btn btn-primary flex flex-row items-center btn-outline rounded-md">
                  <MdMoreHoriz size={18} />
                  More
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-base-200 p-8">
            <h1 className="font-bold text-2xl">Comments</h1>
            <Comment avatar="" bio="" username={user.username} />
            <Comment avatar="" bio="" username={user.username} />
          </div>
        </div>

        <div className="lg:block hidden w-sm ">
          <ToastContainer />
          <div className="sticky bg-base-200 rounded-2xl top-21">
            {isLoadingSuggestedUsers ? (
              <span className="loading loading-spinner"></span>
            ) : suggestUsers && suggestUsers.length > 0 ? (
              suggestUsers.map((user: UserData) => (
                <SuggestedUsers
                  key={user.id}
                  user={user}
                  onFollow={() => followMutate(user.id)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No suggested users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
