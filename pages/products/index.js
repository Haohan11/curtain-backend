import { useRouter } from "next/router";

const ProductsPage = () => {
  const { pathname } = useRouter();
  return <div>{pathname}</div>;
};

export default ProductsPage;
