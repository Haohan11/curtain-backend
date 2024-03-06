import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";

import {
  ProductsList,
  SeriesList,
  ColorTypeList,
  StyleTypeList,
  MaterialList,
  VendorList,
} from "../users-list/List";

const ProductsPage = () => (
  <Routes>
    <Route
      element={
        <>
          <ToolbarWrapper />
          <Outlet />
        </>
      }
    >
      <Route
        path="management"
        element={
          <>
            <PageTitle>商品維護</PageTitle>
            <ProductsList />
          </>
        }
      />
      <Route
        path="series"
        element={
          <>
            <PageTitle>商品系列</PageTitle>
            <SeriesList />
          </>
        }
      />
      <Route
        path="colors"
        element={
          <>
            <PageTitle>色系類別</PageTitle>
            <ColorTypeList />
          </>
        }
      />
      <Route
        path="styles"
        element={
          <>
            <PageTitle>風格類別</PageTitle>
            <StyleTypeList />
          </>
        }
      />
      <Route
        path="material"
        element={
          <>
            <PageTitle>面料材質</PageTitle>
            <MaterialList />
          </>
        }
      />
      <Route
        path="vendor"
        element={
          <>
            <PageTitle>面料材質</PageTitle>
            <VendorList />
          </>
        }
      />
      <Route index element={<Navigate to="/products/management" />} />
    </Route>
  </Routes>
);

export default ProductsPage;
