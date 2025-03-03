import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import AddProduct from "../components/AddProduct";
import Product from "../components/Product";

interface ProductType {
  image: string;
  title: string;
  description: string;
  price: number;
  id: number;
}

const productFetching = async () => {
  const response = await fetch("http://localhost:3000/api/products");

  if (!response.ok) throw Error("Feiled fetch products");

  return response.json();
};

function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["product"],
    queryFn: productFetching,
  });

  if (error) {
    console.error("Error fetching products:", error);
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto lg:max-w-7xl md:max-w-3xl sm:max-w-xl">
      <AddProduct />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
        {data.map((product: ProductType) => (
          <Product
            key={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
