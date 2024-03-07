import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";

import {
  AccountsList,
  RoleList,
} from "../../modules/data-list/List";

const AccountPage = () => (
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
        path="info"
        element={
          <>
            <PageTitle>員工資料</PageTitle>
            <AccountsList />
          </>
        }
      />
      <Route
        path="role"
        element={
          <>
            <PageTitle>角色類別</PageTitle>
            <RoleList />
          </>
        }
      />
      <Route index element={<Navigate to="/products/management" />} />
      <Route path='*' element={<Navigate to='/error/404' />} />
    </Route>
  </Routes>
);

export { AccountPage };
