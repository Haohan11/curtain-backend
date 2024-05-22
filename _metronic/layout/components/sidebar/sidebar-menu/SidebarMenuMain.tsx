import { useState,useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'
import {checkIsActive, KTIcon, WithChildren} from '../../../../helpers'
import { signOut, getSession } from "next-auth/react";
import { useRouter } from 'next/router'

const SidebarMenuMain = () => {

  const logout = async () => {
    signOut({ callbackUrl: "/login" })
  }
 const router = useRouter();  
 const judge = true

  //  const [stockPermission,setStockPermission] = useState<boolean>(true)
  //  const [environmentpermission,setEnvironmentPermission] = useState<boolean>(true)
  //  const [employeepermission,setEmployeePermission] = useState<boolean>(true)

  // useEffect(()=>{
  //   if(router.asPath.includes('stock')&&session.data.permission.stock.view > 0){
  //   setStockPermission(true)
  // }else{
  //   setStockPermission(false)
  // }
  //   if(router.asPath.includes('environment')&&session.data.permission.environment.view > 0){
  //   setEnvironmentPermission(true)
  // }else{
  //   setEnvironmentPermission(false)
  // }
  //   if(router.asPath.includes('employee')&&session.data.permission.account.view > 0){
  //   setEmployeePermission(true)
  // }else{
  //   setEmployeePermission(false)
  // }
  // },[router])



  return (
    <>
      {judge&&
        <SidebarMenuItemWithSub
        to='/stock'
        title='商品管理'
        icon='bi bi-box'
      >
        <SidebarMenuItem to='/stock/management' title='商品維護' hasBullet={true} />
        <SidebarMenuItem to='/stock/series' title='商品系列' hasBullet={true} />
        <SidebarMenuItem to='/stock/color' title='商品顏色' hasBullet={true} />
        <SidebarMenuItem to='/stock/color-scheme' title='色系類別' hasBullet={true} />
        <SidebarMenuItem to='/stock/design' title='風格類別' hasBullet={true} />
        <SidebarMenuItem to='/stock/material' title='面料材質' hasBullet={true} />
        <SidebarMenuItem to='/stock/supplier' title='供應商' hasBullet={true} />
      </SidebarMenuItemWithSub>}
      {judge&&
        <SidebarMenuItemWithSub
        to='/accounts'
        title='人員管理'
        icon='bi bi-person'
      >
        <SidebarMenuItem to='/employee/info' title='員工資料' hasBullet={true} />
        <SidebarMenuItem to='/employee/role' title='角色類別' hasBullet={true} />
      </SidebarMenuItemWithSub>}
      {judge&&
        <SidebarMenuItem to='/environment' title='場景管理' icon='bi bi-bounding-box' />}
      <div className='menu-item'>
        <Link href='/' className={clsx('menu-link without-sub')} onClick={logout} >
            <span className='menu-icon'>
            {' '}
            <KTIcon iconName="bi bi-box-arrow-left" className='fs-2' />
          </span>
          <span className='menu-title'>登出</span></Link>  
      </div>
    </>
  )
}

export { SidebarMenuMain }
