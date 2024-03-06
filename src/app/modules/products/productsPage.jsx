import {Navigate, Routes, Route, Outlet} from 'react-router-dom'
import {PageTitle} from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'

const ProductsPage = () => (
  <Routes>
    <Route
      element={
        <>
          {/* <ProfileHeader /> */}
          <ToolbarWrapper />
          <Outlet />
        </>
      }
    >
      <Route
        path='management'
        element={
          <>
            <PageTitle>商品維護</PageTitle>
            <div>商品維護</div>
          </>
        }
      />
      <Route
        path='series'
        element={
          <>
            <PageTitle>商品系列</PageTitle>
            <div>商品系列</div>
          </>
        }
      />
      <Route
        path='colors'
        element={
          <>
            <PageTitle>色系類別</PageTitle>
            <div>色系類別</div>
          </>
        }
      />
      <Route
        path='styles'
        element={
          <>
            <PageTitle>風格類別</PageTitle>
            <div>風格類別</div>
          </>
        }
      />
      <Route
        path='material'
        element={
          <>
            <PageTitle>面料材質</PageTitle>
            <div>面料材質</div>
          </>
        }
      />
      <Route index element={<Navigate to='/products/management' />} />
    </Route>
  </Routes>
)

export default ProductsPage