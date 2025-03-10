import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import AddProduct from "../components/AddProduct";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Input from "../components/shared/Input";
import { MdOutlineDescription, MdPriceCheck } from "react-icons/md";
import { BsCardText } from "react-icons/bs";
import { BiImage } from "react-icons/bi";

interface ProductType {
  image: string;
  title: string;
  description: string;
  price: number;
  id: number;
}

function HomePage() {
  const [id, setId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [value, setValue] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
  });

  const fetchProducts = async () => {
    const response = await fetch("http://localhost:3000/api/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  };

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const deleteProduct = async (productId: number) => {
    const response = await fetch(
      `http://localhost:3000/api/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to delete product");
    return response.json();
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteProduct,
    onError: () => toast.error("There was an error deleting the product."),
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const editProduct = async () => {
    if (!id) return;
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...value, price: Number(value.price) }),
    });

    if (!response.ok) throw new Error("Failed to edit product");
    return response.json();
  };

  const { mutate: editMutate } = useMutation({
    mutationFn: editProduct,
    onError: () => toast.error("There was an error editing the product."),
    onSuccess: () => {
      toast.success("Product edited successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      handleCloseModal();
    },
  });

  const handleDeleteProduct = (productId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteMutate(productId);
  };

  const handleEditProduct = (event: React.FormEvent) => {
    event.preventDefault();
    editMutate();
  };

  const handleShowModal = (event: React.MouseEvent, product: ProductType) => {
    event.stopPropagation();
    setId(product.id);
    setValue({
      title: product.title,
      description: product.description,
      image: product.image,
      price: String(product.price),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto lg:max-w-7xl md:max-w-3xl sm:max-w-xl">
      <AddProduct />
      {isModalOpen && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 w-full h-screen z-30 bg-opacity-50">
          <form
            className="bg-base-200 popup-animation p-4 px-6 rounded"
            onSubmit={handleEditProduct}
          >
            <h1 className="font-bold text-2xl text-primary my-1">
              Edit Product
            </h1>
            <p className="text-lg my-1">Update this product's details</p>

            <div className="flex gap-4">
              <img
                src={value.image ? value.image : "no-image.jpeg"}
                className="object-cover w-sm h-80 rounded"
                alt="Product Preview"
              />
              <div className="flex w-sm flex-col gap-4">
                <Input
                  name="title"
                  type="text"
                  icon={<BsCardText size={16} />}
                  placeholder="Enter product name"
                  label="Name"
                  onChange={handleChange}
                  value={value.title}
                />
                <Input
                  name="description"
                  type="text"
                  icon={<MdOutlineDescription size={16} />}
                  placeholder="Enter product description"
                  label="Description"
                  onChange={handleChange}
                  value={value.description}
                />
                <Input
                  name="image"
                  type="text"
                  icon={<BiImage size={16} />}
                  placeholder="Enter product image"
                  label="Image"
                  onChange={handleChange}
                  value={value.image}
                />
                <Input
                  name="price"
                  type="number"
                  icon={<MdPriceCheck size={16} />}
                  placeholder="Enter product price"
                  label="Price"
                  onChange={handleChange}
                  value={value.price}
                />
              </div>
            </div>

            <div className="flex items-end gap-2 modal-action justify-end">
              <button
                className="btn btn-error rounded"
                type="button"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button type="submit" className="btn btn-success rounded">
                Edit
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mx-1">
        {productsData.map((product: ProductType) => (
          <Product
            isPending
            key={product.id}
            id={product.id}
            image={product.image ? product.image : "no-image.jpeg"}
            title={product.title}
            description={product.description}
            price={product.price}
            onDelete={(event) => handleDeleteProduct(product.id, event)}
            onEdit={(event) => handleShowModal(event, product)}
            onShow={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default HomePage;
