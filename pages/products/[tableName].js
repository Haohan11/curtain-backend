// import List from "@/data-list/List";

const ProductsPage = ({ tableName }) => {
  return <div>{tableName}</div>;
};

export const getStaticPaths = async () => {
  const tableNameDict = [
    "management",
    "series",
    "colors",
    "styles",
    "material",
    "vendor",
  ];

  const paths = tableNameDict.map((tableName) => ({ params: { tableName } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { tableName } }) => {
  return {
    props: {
      tableName,
    },
  };
};

export default ProductsPage;
