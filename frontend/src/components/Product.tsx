import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const Product = ({
  image,
  title,
  description,
  price,
}: {
  image: string;
  title: string;
  price: number;
  description: string;
}) => {
  return (
    <div className="card bg-base-300 shadow-sm rounded-2xl">
      <img src={image} alt={title + "image"} className="h-40 object-cover rounded-t-2xl" />
      <div className="card-body">
        <h1 className="card-title">{title}</h1>
        <p>{description}</p>
        <p>{price}$</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary btn-outline rounded-xl">
            <FaRegEdit className="size-5" />
          </button>
          <button className="btn btn-error btn-outline rounded-xl">
            <MdDeleteOutline className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
