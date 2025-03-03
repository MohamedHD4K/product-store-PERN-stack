import { BiPlus } from "react-icons/bi";
import { LuRefreshCcw } from "react-icons/lu";
import Input from "./shared/Input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";

const AddProduct = () => {
  const [value, setValue] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
  });

  const handleShowModal = () => {
    (document.getElementById("add_product") as HTMLDialogElement).showModal();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const creatProductFetching = async () => {
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

  const { data, error, mutate , isPending} = useMutation({
    mutationKey: ["product"],
    mutationFn: creatProductFetching,
    onError: () => {
      toast.error("There was an error creating the product.");
      console.log(error);
    },
    onSuccess: () => {
      toast.success("Product Created Successfully!");
      console.log(data);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <div className="flex justify-between items-center p-1 py-4">
      <dialog id="add_product" className="modal">
        <form onSubmit={handleSubmit}>
          <div className="modal-box ">
            <h3 className="font-bold text-lg">Add Prodcut</h3>
            <div className="py-4 flex flex-col gap-3">
              <Input
                name="title"
                type="text"
                placeholder="Enter Product Name"
                label="Product Name"
                onChange={handleChange}
                value={value.title}
              />
              <Input
                name="description"
                type="text"
                placeholder="Enter Product Description"
                label="Product Description"
                onChange={handleChange}
                value={value.description}
              />
              <Input
                name="image"
                type="text"
                placeholder="Enter Product Image"
                label="Product Image"
                onChange={handleChange}
                value={value.image}
              />
              <Input
                name="price"
                type="text"
                placeholder="Enter Product Price"
                label="Product Price"
                onChange={handleChange}
                value={value.price}
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-error">Close</button>
              </form>
                <button type="submit" className="btn btn-success">
                  {isPending ? <span className="loading loading-spinner loading-sm mx-1.5"></span> : "Creat"}
                </button>
            </div>
          </div>
        </form>
      </dialog>

      <button
        className="btn btn-success rounded-full font-bold"
        onClick={handleShowModal}
      >
        <BiPlus className="size-5" /> Add Product
      </button>

      <ToastContainer />
      <LuRefreshCcw className="size-5 hover:scale-120 cursor-pointer duration-150 hover:opacity-50" />
    </div>
  );
};

export default AddProduct;
