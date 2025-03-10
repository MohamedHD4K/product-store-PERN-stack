import { useEffect, useRef } from "react";
import { BiGroup, BiLogIn, BiUser } from "react-icons/bi";
import { LuLogOut } from "react-icons/lu";
import { MdOutlineStorage, MdPayments } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UserData {
  username: string;
  email: string;
  avatar: string;
  cover_img: string;
}

const SideBar = ({
  user,
  onClose,
}: {
  user: UserData;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/logout", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          method: "POST",
        });

        if (!response.ok) throw new Error("have some error");
      } catch (error) {
        console.log(error);
        throw new Error("have some error");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/login");
    },
  });

  return (
    <div
      ref={modalRef}
      className="bg-base-200 border-b border-base-content/10 w-xs flex flex-col fixed rounded-b-2xl z-30 top-16 
      right-0 2xl:right-31 border shadow"
    >
      <div className="relative h-[10rem]">
        <img
          src={(user && user.cover_img) || "background.png"}
          alt="profile backgound image"
          className="object-cover h-[10rem] w-full"
        />
        <div
          onClick={() => navigate("/profile")}
          className="absolute w-full gap-3 cursor-pointer items-center bottom-0 bg-gradient-to-b to-80% to-black/80 from-transparent flex "
        >
          <img
            src={(user && user.avatar) || "avatar.png"}
            alt="user avatar"
            loading="lazy"
            className="size-18 rounded-xl object-cover w-24 ml-2"
          />
          <div className="flex flex-col w-full">
            <span className="text-lg">{user ? user.username : "Username"}</span>
            <span className="text-lg">
              {user ? user.email : "emial@gmail.com"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-3 pt-5">
        <Link
          to="/profile"
          className="flex gap-4 items-center hover:bg-base-300 rounded-lg p-4"
        >
          <BiUser className="size-5 mb-1" />
          <span>Account overview</span>
        </Link>
        <Link
          to="/payment"
          className="flex gap-4 items-center hover:bg-base-300 rounded-lg p-4"
        >
          <MdPayments className="size-5 mb-1" />
          <span>Payment method</span>
        </Link>
        <Link
          to="/store"
          className="flex gap-4 items-center hover:bg-base-300 rounded-lg p-4"
        >
          <MdOutlineStorage className="size-5 mb-1" />
          <span>My products store</span>
        </Link>
        <Link
          to="/social"
          className="flex gap-4 items-center hover:bg-base-300 rounded-lg p-4"
        >
          <BiGroup className="size-5 mb-1" />
          <span>Social account</span>
        </Link>
        <Link
          to="/login"
          className="flex gap-4 items-center hover:bg-base-300 rounded-lg p-4"
        >
          <BiLogIn className="size-5 mb-1" />
          <span>Login</span>
        </Link>
        <div
          onClick={() => mutate()}
          className="flex gap-4 cursor-pointer items-center hover:bg-base-300 rounded-lg p-4"
        >
          <LuLogOut className="size-5 mb-1" />
          <span>
            {isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Logout"
            )}
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SideBar;
