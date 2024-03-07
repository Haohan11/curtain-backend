import {useListView} from '../../core/ListViewProvider'
import {DataListToolbar} from './DataListToolbar'
import {UsersListGrouping} from './UsersListGrouping'
import {ProductsListSearchComponent} from './ProductsListSearchComponent'

const ProductsListHeader = ({which}) => {
  const {selected} = useListView()
  return (
    <div className='d-flex justify-content-between card-header border-0 pt-6'>
      <ProductsListSearchComponent which={which}/>
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <DataListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {ProductsListHeader}
