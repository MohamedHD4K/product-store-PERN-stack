import { useMutation } from "@tanstack/react-query";
import { BiGroup } from "react-icons/bi";
import { LuLogOut } from "react-icons/lu";
import { MdOutlineStorage, MdPayments, MdPerson } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const SideBar = () => {
  const navigate = useNavigate();

  const fetchLogOut = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) throw new Error("have some error");
    } catch (error) {
      console.log(error);
      throw new Error("have some error");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: fetchLogOut,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  return (
    <div
      className="bg-base-200 border-b border-base-content/10 w-xs flex flex-col fixed rounded-b-2xl z-30 top-16 
      right-0 2xl:right-31 border shadow"
    >
      <div className="relative h-[10rem]">
        <img
          src="background.png"
          alt="profile backgound image"
          className="object-cover h-[10rem] w-full"
        />
        <div className="absolute w-full gap-3 items-center bottom-0 bg-gradient-to-b to-80% to-black/80 from-transparent flex ">
          <img
            src="avatar.png"
            alt="user avatar"
            loading="lazy"
            className="size-22 rounded-4xl shadow-xl border-transparent p-2 transition-all"
          />
          <div className="flex flex-col w-full">
            <span className="text-lg">Username</span>
            <span className="text-lg">emial@gmail.com</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-3 pt-5">
        <Link
          to="/profil"
          className="flex gap-4 items-center hover:bg-base-300 rounded-lg p-4"
        >
          <MdPerson className="size-5 mb-1" />
          <span>Account overview</span>
        </Link>
        <Link
          to="/payment"
          className="flex gap-4 items-center hover:bg-base-300 rounded-lg p-4"
        >
          <MdPayments className="size-5 mb-1" />
          <span>Payment methode</span>
        </Link>
        <Link
          to="/store"
          className="flex gap-4 items-center hover:bg-base-300 rounded-lg p-4"
        >
          <MdOutlineStorage className="size-5 mb-1" />
          <span>My products store</span>
        </Link>
        <Link
          to="/soscial"
          className="flex gap-4 items-center hover:bg-base-300 rounded-lg p-4"
        >
          <BiGroup className="size-5 mb-1" />
          <span>Soscial account</span>
        </Link>
        <div className="flex gap-4 cursor-pointer items-center hover:bg-base-300 rounded-lg p-4">
          <LuLogOut className="size-5 mb-1" />
          <span onClick={() => mutate()}>
            {isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Loged out"
            )}
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SideBar;
