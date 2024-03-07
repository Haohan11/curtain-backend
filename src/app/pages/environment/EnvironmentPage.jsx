import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";

import {
    EnvironmentList
} from "../../modules/data-list/List";

const EnvironmentPage = () => (
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
        path="main"
        element={
          <>
            <PageTitle>場景管理</PageTitle>
            <EnvironmentList />
          </>
        }
      />
      <Route index element={<Navigate to="/products/management" />} />
      <Route path='*' element={<Navigate to='/error/404' />} />
    </Route>
  </Routes>
);

export { EnvironmentPage };
