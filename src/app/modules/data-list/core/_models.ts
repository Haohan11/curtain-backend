import {ID, Response} from '../../../../_metronic/helpers'
export type User = {
  id?: ID
  name?: string
  avatar?: string
  email?: string
  position?: string
  role?: string
  last_login?: string
  two_steps?: boolean
  joined_day?: string
  online?: boolean
  initials?: {
    label: string
    state: string
  }
}

export type Products = {
  id?: ID
  enable?: boolean
  name?: string
  style?: string
  series?: string
  vendor?: string
  color?: string
  color_type?: string
  material?: string
  style_type?: string
  block?: number
  absorption?: number
  description?: string
  created_time?: string
}

export type Series = {
  id?: ID
  enable?: boolean
  name?: string
  comments?: string
}

export type ColorType = {
  id?: ID
  enable?: boolean
  name?: string
  comments?: string
}

export type StyleType = {
  id?: ID
  enable?: boolean
  name?: string
  comments?: string
}

export type Material = {
  id?: ID
  enable?: boolean
  name?: string
  comments?: string
}

export type Vendor = {
  id?: ID
  enable?: boolean
  name?: string
  comments?: string
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/300-6.jpg',
  position: 'Art Director',
  role: 'Administrator',
  name: '',
  email: '',
}
