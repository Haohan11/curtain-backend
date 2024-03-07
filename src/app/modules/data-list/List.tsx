import { ListViewProvider, useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'
import { ListHeader } from './components/header/ListHeader'
import { Table } from './table/Table'
import { UserEditModal } from './user-edit-modal/UserEditModal'
import { Content } from '../../../_metronic/layout/components/content'

const List = ({ which, category = which }) => {
  const { itemIdForUpdate } = useListView()
  return (
    <>
      <div className='px-8'>
        <ListHeader which={which} />
        <Table which={which} category={category} />
      </div>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const ListWrapper = (which, category) => (() => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <Content>
          <List which={which} category={category} />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
))

const productManageItems = [
  "products", "series", "colorType", "styleType", "material", "vendor"
]

const [
  ProductsList,
  SeriesList,
  ColorTypeList,
  StyleTypeList,
  MaterialList,
  VendorList] = productManageItems.map(item => ListWrapper(item, "products"))

const accountManageItems = [
  "accounts", "role"
]

const [AccountsList, RoleList] = accountManageItems.map(item => ListWrapper(item, "accounts"))

const EnvironmentList = ListWrapper("environment")

export {
  ProductsList, SeriesList, ColorTypeList, StyleTypeList, MaterialList, VendorList, AccountsList, RoleList, EnvironmentList
}
