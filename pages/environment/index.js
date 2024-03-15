import dynamic from "next/dynamic";
import currentTable from "@/data-list/globalVariable/currentTable";
import { PageTitle } from "@/_metronic/layout/core";
// import { ToolbarWrapper } from "@/_metronic/layout/components/toolbar";

const DynamicList = dynamic(
  async () => {
    const List = await import("@/data-list/List");
    return List;
  },
  {
    ssr: false,
  }
);

const DyToolbarWrapper = dynamic(
  async () => {
    const { ToolbarWrapper } = await import("@/_metronic/layout/components/toolbar");
    return ToolbarWrapper;
  },
  {
    ssr: false,
  }
);

const EnvironmentPage = () => {
  currentTable.set("environment");

  return (
    <>
      <DyToolbarWrapper />
      <PageTitle>場景管理</PageTitle>
      <DynamicList />
    </>
  );
};

export default EnvironmentPage;
