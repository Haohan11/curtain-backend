import { KTIcon } from '@/_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import { useTableData } from '../core/TableDataProvider'
import dict from '../dictionary/tableDictionary'

const EditModalHeader = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()
  const { table } = useTableData()
  const createMode = itemIdForUpdate === null
  const { createHeaderText } = dict

  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder m-0'>
        {createMode ? `新增${createHeaderText[table]}` : "編輯"}
      </h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => setItemIdForUpdate(undefined)}
        style={{ cursor: 'pointer' }}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
      {/* end::Close */}
    </div>
  )
}

export { EditModalHeader }
