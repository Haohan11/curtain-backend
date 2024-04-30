import { useState, useEffect } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from './columns/CustomHeaderColumn'
import { CustomRow } from './columns/CustomRow'
import { User } from '../core/_models'
import { useListView } from '../core/ListViewProvider'
import { TablePagination } from '../components/pagination/TablePagination'
import { useTableData } from '@/data-list/core/tableDataProvider'
import { useRouter } from 'next/router'

import { getDataRequest } from "../core/request"

import currentTable from '../globalVariable/currentTable'
import dict from '../dictionary/tableDictionary'

const { column } = dict

const fetchTableData = async ({ page = 1, size = 5 }) => await getDataRequest({ page, size })

const Table = () => {
  const router = useRouter()
  const { setItemIdForUpdate} = useListView()
  const closeModal = () => setItemIdForUpdate(undefined)
  const tableName = currentTable.get()
  const columns = column[tableName]
  const { tableData, setTableData } = useTableData()
  const [totalPages, setTotalPages] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    closeModal()

    const { query: { page, size } } = router;
    (async () => {
      setIsLoading(true)
      const result = await fetchTableData({ page, size })
      setIsLoading(false)
      if (result === false) return

      const { data, totalPages } = result
      setTableData(data)
      setTotalPages(totalPages)
    })()
  }, [router])

  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data: tableData,
  })

  return (
    <div className='py-4'>
      <div className='table-responsive mb-8'>
        <table
          id='kt_table_users'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}
        >
          <thead>
            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              {headers.map((column: ColumnInstance<User>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<User>, i) => {
                prepareRow(row)
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                    <span className=''>
                      {
                        isLoading ? "載入中..." : "目前沒有資料"
                      }
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination totalPages={totalPages} />
      {/* {isLoading && <UsersListLoading />} */}
    </div>
  )
}

export { Table }
