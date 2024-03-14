import { useEffect } from "react";
import List from "@/data-list/List";
import dynamic from "next/dynamic";
import currentTable from "@/data-list/globalVariable/currentTable";

const DynamicList = dynamic(async() => {
  const List = await import("@/data-list/List")
  return List
}, {
  ssr: false
})

const ProductsPage = ({ tableName }) => {
  currentTable.set(tableName)
  
  return <DynamicList />;
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
