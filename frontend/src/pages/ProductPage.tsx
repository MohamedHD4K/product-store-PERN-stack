import { useResolvedPath } from "react-router-dom";

const ProductPage = () => {
  const { pathname } = useResolvedPath("");
  const path = pathname.split("/");

  return (
    <div className="flex gap-2">
      
    </div>
  );
};

export default ProductPage;
