import { useState, useEffect } from 'react'
import { useTable, ColumnInstance, Row } from 'react-table'
import { CustomHeaderColumn } from './columns/CustomHeaderColumn'
import { CustomRow } from './columns/CustomRow'
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider'
import { usersColumns, productsColumns, seriesColumns, colorSchemeColumns, designColumns, materialColumns, vendorColumns, accountsColumns, roleColumns, environmentColumns } from './columns/_columns'
import { User } from '../core/_models'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { TablePagination } from '../components/pagination/TablePagination'

import { useRouter } from 'next/router'

import currentTable from '../globalVariable/currentTable'

const dict = {
  products: productsColumns,
  series: seriesColumns,
  colorScheme: colorSchemeColumns,
  design: designColumns,
  material: materialColumns,
  vendor: vendorColumns,
  accounts: accountsColumns,
  role: roleColumns,
  environment: environmentColumns,
}

const TABLEDATAURL = `${process.env.NEXT_PUBLIC_BACKENDURL}/product`
const fetchTableData = async ({ page = 1, size = 10 }) => {
  const res = await fetch(`${TABLEDATAURL}?page=${page}&size=${size}`)
  const { total, totalPages, data } = await res.json()
  return { total, totalPages, data }
}

const Table = () => {
  const router = useRouter()
  const tableName = currentTable.get()
  const columns = dict[tableName]
  const [tableData, setTableData] = useState([])
  const [totalPages, setTotalPages] = useState(null)

  useEffect(() => {
    if (!router.isReady) return

    const { query: { page, size } } = router;
      (async () => {
        const { data, totalPages } = await fetchTableData({ page, size })
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
                    No matching records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination totalPages={totalPages}/>
      {/* {isLoading && <UsersListLoading />} */}
    </div>
  )
}

export { Table }
