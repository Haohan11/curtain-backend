import {FC, useState, createContext, useContext, useMemo} from 'react'
import {
  WithChildren,
} from '../../../../_metronic/helpers'

const TableContext = createContext(null)

const TableProvider: FC<WithChildren> = ({children}) => {
  const [table, setTable] = useState(null)

  return (
    <TableContext.Provider
      value={{table, setTable}}
    >
      {children}
    </TableContext.Provider>
  )
}

const useTableData = () => useContext(TableContext)

export {TableProvider, useTableData}
