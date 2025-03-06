import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Product = ({
  image,
  title,
  description,
  price,
  onDelete,
  onEdit,
  onShow,
  id,
  isPending,
}: {
  image: string;
  title: string;
  price: number;
  description: string;
  id: number;
  isPending: boolean;
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
  onEdit?: React.MouseEventHandler<HTMLButtonElement>;
  onShow?: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div
      id={id.toString()}
      onClick={onShow}
      className="card bg-base-300 shadow-lg rounded-2xl hover:translate-1 transition-all cursor-pointer"
    >
      <LazyLoadImage
        src={image ? image : "no-image.jpeg"}
        alt={title + "image"}
        className="h-50 object-cover rounded-t-2xl"
      />
      <div className="card-body">
        <h1 className="card-title text-3xl text-primary">{title}</h1>
        <p className="text-lg">{description}</p>
        <p className="text-success text-2xl font-bold">{price}$</p>
        <div className="card-actions justify-end">
          <button
            onClick={onEdit}
            className="btn btn-primary btn-outline rounded-xl"
          >
            {!isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <FaRegEdit className="size-5" />
            )}
          </button>
          <button
            className="btn btn-error btn-outline rounded-xl"
            onClick={onDelete}
          >
            {!isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <MdDeleteOutline className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
