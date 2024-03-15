import dynamic from "next/dynamic";
import currentTable from "@/data-list/globalVariable/currentTable";

const DynamicList = dynamic(
  async () => {
    const List = await import("@/data-list/List");
    return List;
  },
  {
    ssr: false,
  }
);

const EnvironmentPage = () => {
  currentTable.set("environment");

  return <DynamicList />;
};

export default EnvironmentPage;