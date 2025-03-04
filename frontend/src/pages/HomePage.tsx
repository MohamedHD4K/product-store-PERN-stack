import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import AddProduct from "../components/AddProduct";
import Product from "../components/Product";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ProductType {
  image: string;
  title: string;
  description: string;
  price: number;
  id: number;
}

function HomePage() {
  const [id, setId] = useState(0);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productsFetching = async () => {
    const response = await fetch("http://localhost:3000/api/products");

    if (!response.ok) throw Error("Failed fetch products");

    return response.json();
  };

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: productsFetching,
  });

  const deleteProductFetching = async () => {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    if (!response.ok) throw Error("Failed Fetch Products");

    return response.json();
  };

  const editProductFetching = async () => {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (!response.ok) throw Error("Failed Fetch Products");

    return response.json();
  };

  const { mutate: deleteMutate } = useMutation({
    mutationKey: ["product"],
    mutationFn: deleteProductFetching,
    onError: (error) => {
      toast.error("There was an error delete the product.");
      console.log(error.message);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
    },
  });

  const { mutate: editMutate } = useMutation({
    mutationKey: ["product"],
    mutationFn: editProductFetching,
    onError: (error) => {
      toast.error("There was an error delete the product.");
      console.log(error.message);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
    },
  });

  const handleDeleteProduct = (_id: number) => {
    setId(_id);
    deleteMutate();
  };

  const handleEditProduct = (
    event: React.FormEvent<HTMLButtonElement>,
    _id: number
  ) => {
    event.stopPropagation();
    setId(_id);
    editMutate();
  };

  const handleShowModal = (event: React.FormEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto lg:max-w-7xl md:max-w-3xl sm:max-w-xl">
      <AddProduct />
      {isModalOpen && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 w-full h-screen z-30 bg-opacity-50">
          <h1>Edit Product</h1>
          <p>Update this product's details </p>
          <div className="bg-base-200 md:w-sm p-4 rounded ">
            <button className="btn btn-error" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mx-1">
        {productsData.map((product: ProductType) => (
          <Product
            isPending
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
            onDelete={() => handleDeleteProduct(product.id)}
            onEdit={handleShowModal}
            onShow={() => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
