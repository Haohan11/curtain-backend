import { useEffect } from 'react'
import { ListViewProvider, useListView } from './core/ListViewProvider'
import { TableProvider, useTableData } from './core/TableDataProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'
import { ListHeader } from './components/header/ListHeader'
import { Table } from './table/Table'
import { EditModal } from './edit-modal/EditModal'
import { Content } from '@/_metronic/layout/components/content'

import { useRouter } from 'next/router'
import currentTable from "@/data-list/globalVariable/currentTable"

const List = () => {
  const { itemIdForUpdate } = useListView()
  const { query } = useRouter()

  // const { setTable } = useTableData()

  // useEffect(() => {
  //   setTable(which)
  // }, [setTable])

  return (
    <>
      <div className='px-8'>
        {/* {JSON.stringify(query)} */}
        <ListHeader />
        <Table />
      </div>
      {itemIdForUpdate !== undefined && <EditModal />}
    </>
  )
}

const ListWrapper = () => (
  // <QueryRequestProvider>
    // <QueryResponseProvider>
      <TableProvider>
        <ListViewProvider>
          <Content>
            {/* <div>{currentTable.get()}</div> */}
            <List />
          </Content>
        </ListViewProvider>
      </TableProvider>
    // </QueryResponseProvider>
  // </QueryRequestProvider>
)

export default ListWrapper

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
