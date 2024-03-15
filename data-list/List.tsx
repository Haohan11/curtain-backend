import { ListViewProvider, useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'
import { ListHeader } from './components/header/ListHeader'
import { Table } from './table/Table'
import { EditModal } from './edit-modal/EditModal'
import { Content } from '@/_metronic/layout/components/content'

const List = () => {
  const { itemIdForUpdate } = useListView()

  return (
    <>
      <div className='px-8'>
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
  <ListViewProvider>
    <Content>
      <List />
    </Content>
  </ListViewProvider>
  // </QueryResponseProvider>
  // </QueryRequestProvider>
)

export default ListWrapper

