import { MdOutlinePalette } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { BsFolder } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import SideBar from "./SideBar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Input from "./shared/Input";

const NavBar = () => {
  const [isShowProfileModal, setIsShowProfileModal] = useState(false);

  const handleShowSideBar = () => setIsShowProfileModal((prev) => !prev);
  const handleCloseSidebar = () => setIsShowProfileModal(false);

  const { data: userData, isLoading } = useQuery({
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

  return (
    <div
      className={`bg-base-200/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-20 ${
        !userData && "hidden"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="navbar min-h-[4rem] justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="flex-1 lg:flex-none flex items-center outline-none gap-3 justify-center hover:opacity-80 duration-150"
          >
            <IoCartOutline className="size-8 text-green-500 mb-1 font-bold" />
            <span className="bg-gradient-to-l font-bold to-green-500 from-gray-500 bg-clip-text text-transparent text-3xl">
              Products Store
            </span>
          </Link>
          <div className="w-lg">
            <Input
              type="text"
              icon={<BiSearch size={17} />}
              placeholder="Search"
              name="search"
            />
          </div>
          {/* RIGHT SECTION */}
          <div className="flex gap-10 justify-center items-center">
            <MdOutlinePalette className="size-5 hover:scale-120 cursor-pointer duration-150 hover:opacity-50" />
            <BsFolder className="size-5 hover:scale-120 cursor-pointer duration-150 hover:opacity-50" />
            {isLoading ? (
              <span className="loading loading-spinner" />
            ) : (
              <img
                src={userData?.avatar || "avatar.png"}
                alt="User avatar"
                loading="lazy"
                onClick={handleShowSideBar}
                className="size-6 hover:scale-120 cursor-pointer duration-150 hover:opacity-80 rounded-md"
              />
            )}
          </div>
        </div>
      </div>
      {isShowProfileModal && (
        <SideBar user={userData} onClose={handleCloseSidebar} />
      )}
    </div>
  );
};

export default NavBar;
