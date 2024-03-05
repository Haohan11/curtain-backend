import {Navigate, Routes, Route, Outlet} from 'react-router-dom'
import {PageTitle} from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
// import {Overview} from './components/Overview'
// import {Projects} from './components/Projects'
// import {Campaigns} from './components/Campaigns'
// import {Documents} from './components/Documents'
// import {Connections} from './components/Connections'
// import {ProfileHeader} from './ProfileHeader'

const profileBreadCrumbs = [
  {
    title: 'Products',
    path: '/produtcs',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

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
            <PageTitle breadcrumbs={profileBreadCrumbs}>商品維護</PageTitle>
            <div>商品維護</div>
          </>
        }
      />
      <Route
        path='series'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>商品系列</PageTitle>
            <div>商品系列</div>
          </>
        }
      />
      <Route
        path='colors'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>色系類別</PageTitle>
            <div>色系類別</div>
          </>
        }
      />
      <Route
        path='styles'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>風格類別</PageTitle>
            <div>風格類別</div>
          </>
        }
      />
      <Route
        path='material'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>面料材質</PageTitle>
            <div>面料材質</div>
          </>
        }
      />
      <Route index element={<Navigate to='/products/management' />} />
    </Route>
  </Routes>
)

export default ProductsPage