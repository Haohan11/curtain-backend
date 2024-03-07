import {KTIcon} from '../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {UsersListFilter} from './UsersListFilter'

const DataListToolbar = () => {
  const {setItemIdForUpdate} = useListView()
  const openAddModal = () => {
    setItemIdForUpdate(null)
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <UsersListFilter />

      <button type='button' className='btn btn-primary' onClick={openAddModal}>
        <KTIcon iconName='plus' className='fs-2' />
        新增
      </button>
    </div>
  )
}

export {DataListToolbar}
