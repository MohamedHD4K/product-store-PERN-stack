import { BiGroup } from "react-icons/bi";
import { LuLogOut } from "react-icons/lu";
import { MdOutlineStorage, MdPayments, MdPerson } from "react-icons/md";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div
      className="bg-base-200 border-b border-base-content/10 w-xs flex flex-col fixed z-30 top-16 p-2 pt-7 
      right-31 border shadow"
    >
      <div className="p-2 flex justify-center items-center">
        <img
          src="avatar.png"
          alt="user avatar"
          loading="lazy"
          className="size-40 rounded-4xl border border-transparent hover:border-white p-1 transition-all"
        />
      </div>

      <Link to="/profil" className="flex gap-4 items-center hover:bg-base-300 p-4">
        <MdPerson className="size-5 mb-1" />
        <span>Account overview</span>
      </Link>
      <Link to="" className="flex gap-4 items-center hover:bg-base-300 p-4">
        <MdPayments className="size-5 mb-1" />
        <span>Payment methode</span>
      </Link>
      <Link to="" className="flex gap-4 items-center hover:bg-base-300 p-4">
        <MdOutlineStorage className="size-5 mb-1" />
        <span>My products store</span>
      </Link>
      <Link to="" className="flex gap-4 items-center hover:bg-base-300 p-4">
        <BiGroup className="size-5 mb-1" />
        <span>Soscial account</span>
      </Link>
      <Link to="" className="flex gap-4 items-center hover:bg-base-300 p-4">
        <LuLogOut className="size-5 mb-1" />
        <span>Loged out</span>
      </Link>
    </div>
  );
};

export default SideBar;
