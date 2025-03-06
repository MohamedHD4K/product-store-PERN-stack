import { useQuery } from "@tanstack/react-query";
import { useResolvedPath } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { BsStar, BsStarFill } from "react-icons/bs";
import { MdOutlineFavorite } from "react-icons/md";
import Input from "../components/shared/Input";

const ProductPage = () => {
  const { pathname } = useResolvedPath("");
  const id = pathname.split("/").pop();

  const getProductFetch = async () => {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);

    if (!response.ok) throw new Error("Failed to fetch products");

    return response.json();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: getProductFetch,
  });

  if (isLoading) return <LoadingSpinner />;

  const username = "Username";

  return (
    <div className="flex justify-center items-center ">
      <div className="flex gap-5 bg-base-300 m-2 p-5 w-7xl rounded-xl  ">
        <div className="flex flex-col gap-3 w-3xl">
          <img
            loading="lazy"
            src={data[0].image ? data[0].image : "../no-image.jpeg"}
            className="object-cover w-3xl rounded"
            alt={`${data[0].title} Image`}
          />
          <div className="flex gap-10 p-5">
            <img
              src="../avatar.png"
              className="rounded-full lg:w-18 lg:h-18 md:w-15 md:h-15 w-14 h-14"
            />
            <div className="w-full">
              <h1 className="text-start font-medium text-primary lg:text-xl md:text-lg sm:text-md">
                {username}
              </h1>
              <p className="text-start text-secondary mt-2 lg:text-lg md:text-md sm:text-sm">
                <Input
                  name="comment"
                  placeholder="Add new comment"
                  type="text"
                />
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-between h-80">
            <h1 className="text-2xl font-medium">{data[0].title}</h1>

            <div className="flex gap-3">
              <div className="text-amber-400 flex gap-1">
                <BsStarFill />
                <BsStarFill />
                <BsStarFill />
                <BsStarFill />
                <BsStar />
              </div>
              157 Reviews
            </div>

            <div className="flex gap-2">
              <span className="text-2xl font-semibold">{data[0].price}$</span>
              <span className="text-2xl font-semibold text-gray-400 line-through">
                {data[0].price * 1.5}$
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h1>Colors</h1>
              <div className="flex gap-2">
                <p className="w-10 h-10 rounded hover:bg-amber-600 duration-150 cursor-pointer bg-amber-500"></p>
                <p className="w-10 h-10 rounded hover:bg-red-600 duration-150 cursor-pointer bg-red-500"></p>
                <p className="w-10 h-10 rounded hover:bg-green-600 duration-150 cursor-pointer bg-green-500"></p>
                <p className="w-10 h-10 rounded hover:bg-blue-600 duration-150 cursor-pointer bg-blue-500"></p>
                <p className="w-10 h-10 rounded hover:bg-gray-600 duration-150 cursor-pointer bg-gray-500"></p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="btn btn-success rounded">Add to card</button>
              <button className="btn btn-error btn-outline rounded">
                <MdOutlineFavorite className="size-4" />
              </button>
            </div>
          </div>

          <p className="text-lg w-sm">{data[0].description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
