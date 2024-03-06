import { ListViewProvider, useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'
import { UsersListHeader } from './components/header/UsersListHeader'
import { Table } from './table/Table'
import { UserEditModal } from './user-edit-modal/UserEditModal'
import { Content } from '../../../_metronic/layout/components/content'

const List = ({ which }) => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      <div className='px-8'>
        <UsersListHeader />
        <Table which={which} />
      </div>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const ListWrapper = (which) => (() => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <Content>
          <List which={which} />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
))

const ProductsList = ListWrapper("products")
// const UsersList = ListWrapper("users")
const SeriesList = ListWrapper("series")
const ColorTypeList = ListWrapper("colorType")
const StyleTypeList = ListWrapper("styleType")
const MaterialList = ListWrapper("material")
const VendorList = ListWrapper("vendor")

export {
  ProductsList, SeriesList, ColorTypeList, StyleTypeList, MaterialList, VendorList
}
