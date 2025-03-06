import { BiPlus } from "react-icons/bi";
import { LuRefreshCcw } from "react-icons/lu";
import Input from "./shared/Input";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";

const AddProduct = () => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const createProductFetching = async () => {
    const response = await fetch("http://localhost:3000/api/products", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(value),
    });

    if (!response.ok) throw Error("Feiled Fetch Products");

    return response.json();
  };

  const { error, mutate, isPending } = useMutation({
    mutationKey: ["product"],
    mutationFn: createProductFetching,
    onError: () => {
      toast.error("There was an error creating the product.");
      console.log(error);
    },
    onSuccess: () => {
      toast.success("Product Created Successfully!");
      queryClient.invalidateQueries(["products"]);
      setValue({
        title: "",
        description: "",
        image: "",
        price: "",
      });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <div className="flex justify-between items-center p-1 py-4">
      {isModalOpen && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 w-full h-screen z-30 bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="bg-base-200 popup-animation p-4 px-6 rounded"
          >
            <h3 className="font-bold text-2xl text-primary my-1">
              Add Prodcut
            </h3>
            <p className="text-lg pb-1">Create new product template</p>
            <div className="flex gap-3 items-center">
              <img
                src={value.image || "no-image.jpeg"}
                alt="product image"
                className="object-cover w-sm h-80 rounded"
              />
              <div className="flex w-sm flex-col gap-4">
                <Input
                  name="title"
                  type="text"
                  placeholder="Enter product name"
                  label="Name"
                  onChange={handleChange}
                  value={value.title}
                />
                <Input
                  name="description"
                  type="text"
                  placeholder="Enter product description"
                  label="Description"
                  onChange={handleChange}
                  value={value.description}
                />
                <Input
                  name="image"
                  type="text"
                  placeholder="Enter product image"
                  label="Image"
                  onChange={handleChange}
                  value={value.image}
                />
                <Input
                  name="price"
                  type="number"
                  placeholder="Enter product price"
                  label="Price"
                  onChange={handleChange}
                  value={value.price}
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                onClick={handleCloseModal}
                className="btn btn-error rounded"
              >
                Close
              </button>
              <button type="submit" className="btn btn-success rounded">
                {isPending ? (
                  <span className="loading loading-spinner loading-sm mx-1.5"></span>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        className="btn btn-success rounded-full font-bold"
        onClick={handleShowModal}
      >
        <BiPlus className="size-5" />
        <span>Add Product</span>
      </button>

      <ToastContainer />
      <LuRefreshCcw
        onClick={() => window.location.reload()}
        className="size-5 hover:scale-120 cursor-pointer duration-150 hover:opacity-50"
      />
    </div>
  );
};

export default AddProduct;
