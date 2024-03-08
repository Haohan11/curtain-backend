import { useEffect } from 'react'
import { ListViewProvider, useListView } from './core/ListViewProvider'
import { TableProvider, useTableData } from './core/TableDataProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'
import { ListHeader } from './components/header/ListHeader'
import { Table } from './table/Table'
import { EditModal } from './edit-modal/EditModal'
import { Content } from '../../../_metronic/layout/components/content'

const List = ({ which }) => {
  const { itemIdForUpdate } = useListView()
  const { table, setTable } = useTableData()

  useEffect(() => {
    setTable(which)
  }, [setTable])

  return (
    <>
      <div className='px-8'>
        {table && <ListHeader />}
        {table && <Table />}
      </div>
      {itemIdForUpdate !== undefined && <EditModal />}
    </>
  )
}

const ListWrapper = (which) => (() => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <TableProvider>
        <ListViewProvider>
          <Content>
            <List which={which} />
          </Content>
        </ListViewProvider>
      </TableProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
))

const tables = [
  "products", "series", "colorScheme", "design", "material", "vendor", "accounts", "role", "environment"
]

const [
  ProductsList,
  SeriesList,
  ColorSchemeList,
  DesignList,
  MaterialList,
  VendorList,
  AccountsList,
  RoleList,
  EnvironmentList
] = tables.map(item => ListWrapper(item))

export {
  ProductsList, SeriesList, ColorSchemeList, DesignList, MaterialList, VendorList, AccountsList, RoleList, EnvironmentList
}
