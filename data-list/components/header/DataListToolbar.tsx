import {KTIcon} from '@/_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {UsersListFilter} from './UsersListFilter'
import { useState,useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const DataListToolbar = () => {
  const {setItemIdForUpdate} = useListView()
  const openAddModal = () => {
    setItemIdForUpdate(null)
  }

  // // const {session} = useSession();
  const router = useRouter();
  const judge = true

  // const [permission,setPermission] = useState<boolean>(true)
  // useEffect(()=>{
  //   if(router.asPath.includes('stock')&&session.data.permission.stock.motify > 0){
  //   setPermission(true)
  // }else{
  //   setPermission(false)
  // }
  //   if(router.asPath.includes('environment')&&session.data.permission.environment.motify > 0){
  //   setPermission(true)
  // }else{
  //   setPermission(false)
  // }
  //   if(router.asPath.includes('employee')&&session.data.permission.account.motify > 0){
  //   setPermission(true)
  // }else{
  //   setPermission(false)
  // }
  // },[router])

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <UsersListFilter />

      {
        judge&&
        <button type='button' className='btn btn-primary' onClick={openAddModal}>
        <KTIcon iconName='plus' className='fs-2' />
        新增
      </button>
      }
    </div>
  )
}

export {DataListToolbar}
