import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";

import {
  ProductsList,
  SeriesList,
  ColorSchemeList,
  DesignList,
  MaterialList,
  VendorList,
} from "../../modules/data-list/List";

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
            <ColorSchemeList />
          </>
        }
      />
      <Route
        path="styles"
        element={
          <>
            <PageTitle>風格類別</PageTitle>
            <DesignList />
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
            <PageTitle>供應商</PageTitle>
            <VendorList />
          </>
        }
      />
      <Route index element={<Navigate to="/products/management" />} />
      <Route path='*' element={<Navigate to='/error/404' />} />
    </Route>
  </Routes>
);

export { ProductsPage };
