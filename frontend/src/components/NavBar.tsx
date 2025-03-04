import { MdOutlinePalette } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { BsFolder } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

const NavBar = () => {
  return (
    <div className="bg-base-200/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
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
          {/* RIGHT SECTION */}
          <div className="flex gap-10 justify-center">
            <MdOutlinePalette className="size-5 hover:scale-120 cursor-pointer duration-150 hover:opacity-50" />
            <BsFolder className="size-5 hover:scale-120 cursor-pointer duration-150 hover:opacity-50" />
            <BiSearch className="size-5 hover:scale-120 cursor-pointer duration-150 hover:opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
