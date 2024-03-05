import { Content } from "../../../_metronic/layout/components/content";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";

const ProductPage = () => {
  return (
    <>
      <PageTitle>商品管理</PageTitle>
      <ToolbarWrapper />
      <Content>
        <div>ProductPage</div>
      </Content>
    </>
  );
};

export default ProductPage;
