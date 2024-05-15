import clsx from 'clsx'
import Link from 'next/link'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'
import {checkIsActive, KTIcon, WithChildren} from '../../../../helpers'
import { signOut, getSession } from "next-auth/react";

const SidebarMenuMain = () => {

  const logout = async () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <>
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
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/accounts'
        title='人員管理'
        icon='bi bi-person'
      >
        <SidebarMenuItem to='/employee/info' title='員工資料' hasBullet={true} />
        {/* <SidebarMenuItem to='/accounts/role' title='角色類別' hasBullet={true} /> */}
      </SidebarMenuItemWithSub>
      <SidebarMenuItem to='/environment' title='場景管理' icon='bi bi-bounding-box' />
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
