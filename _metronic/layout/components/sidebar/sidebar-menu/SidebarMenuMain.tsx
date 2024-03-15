import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'

const SidebarMenuMain = () => {

  return (
    <>
      <SidebarMenuItemWithSub
        to='/products'
        title='商品管理'
        icon='bi bi-box'
      >
        <SidebarMenuItem to='/products/management' title='商品維護' hasBullet={true} />
        <SidebarMenuItem to='/products/series' title='商品系列' hasBullet={true} />
        <SidebarMenuItem to='/products/colors' title='色系類別' hasBullet={true} />
        <SidebarMenuItem to='/products/design' title='風格類別' hasBullet={true} />
        <SidebarMenuItem to='/products/material' title='面料材質' hasBullet={true} />
        <SidebarMenuItem to='/products/vendor' title='供應商' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/accounts'
        title='人員管理'
        icon='bi bi-person'
      >
        <SidebarMenuItem to='/accounts/info' title='員工資料' hasBullet={true} />
        <SidebarMenuItem to='/accounts/role' title='角色類別' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItem to='/environment' title='場景管理' icon='bi bi-bounding-box' />
    </>
  )
}

export { SidebarMenuMain }
