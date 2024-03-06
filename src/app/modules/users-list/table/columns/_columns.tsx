import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserLastLoginCell } from './UserLastLoginCell'
import { UserTwoStepsCell } from './UserTwoStepsCell'
import { UserActionsCell } from './UserActionsCell'
import { ProductsActionsCell } from './ProductsActionsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import {
  User, Products, Series, ColorType, StyleType, Material, Vendor
} from '../../core/_models'
import { EnableCell } from './enableCell'
import { ProductAvaliableCell } from './ProductAvaliableCell'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
  // {
  //   Header: (props) => <UserSelectionHeader tableProps={props} />,
  //   id: 'selection',
  //   Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  // },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Name' className='min-w-125px' />,
    id: 'name',
    Cell: ({ ...props }) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Role' className='min-w-125px' />,
    accessor: 'role',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Last login' className='min-w-125px' />
    ),
    id: 'last_login',
    Cell: ({ ...props }) => <UserLastLoginCell last_login={props.data[props.row.index].last_login} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Two steps' className='min-w-125px' />
    ),
    id: 'two_steps',
    Cell: ({ ...props }) => <UserTwoStepsCell two_steps={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Joined day' className='min-w-125px' />
    ),
    accessor: 'joined_day',
  },
]

const productsColumns: ReadonlyArray<Column<Products>> = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ProductsActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='上架狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <ProductAvaliableCell enable={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='商品型號' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='商品樣式' className='min-w-125px' />,
    accessor: 'style',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='商品系列' className='min-w-125px' />
    ),
    accessor: 'series',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='創建時間' className='min-w-125px' />
    ),
    accessor: 'created_time',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='供應商' className='min-w-125px' />
    ),
    accessor: 'vendor',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='商品顏色' className='min-w-125px' />
    ),
    accessor: 'color',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='色系類別' className='min-w-125px' />
    ),
    accessor: 'color_type',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='面料材質' className='min-w-125px' />
    ),
    accessor: 'material',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='商品風格' className='min-w-125px' />
    ),
    accessor: 'style_type',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='遮光效果' className='min-w-125px' />
    ),
    accessor: 'block',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='吸音效果' className='min-w-125px' />
    ),
    accessor: 'absorption',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='商品描述' className='min-w-125px' />
    ),
    accessor: 'description',
  },
]

const seriesColumns: ReadonlyArray<Column<Series>> = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ProductsActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='系列編號' className='min-w-125px' />,
    accessor: 'id',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='系列名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comments',
  },
]

const colorTypeColumns: ReadonlyArray<Column<ColorType>> = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ProductsActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='色系名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comments',
  },
]

const styleTypeColumns: ReadonlyArray<Column<StyleType>> = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ProductsActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='風格名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comments',
  },
]

const materialColumns: ReadonlyArray<Column<Material>> = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ProductsActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='面料名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comments',
  },
]

const vendorColumns: ReadonlyArray<Column<Vendor>> = [
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='操作' className='text-start min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <ProductsActionsCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='啟用狀態' className='min-w-125px' />
    ),
    id: 'enable',
    Cell: ({ ...props }) => <EnableCell enable={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='供應商編號' className='min-w-125px' />,
    accessor: 'id',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='供應商名稱' className='min-w-125px' />,
    accessor: 'name',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='備註' className='min-w-125px' />,
    accessor: 'comments',
  },
]

export {
  usersColumns, productsColumns, seriesColumns, colorTypeColumns, styleTypeColumns, materialColumns, vendorColumns
}
