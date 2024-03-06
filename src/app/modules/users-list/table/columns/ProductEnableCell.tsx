import {FC} from 'react'

type Props = {
  enable?: boolean
}

const ProductEnableCell: FC<Props> = ({enable}) => (
  <div className={`badge ${enable ? "badge-light-success" : "badge-light-danger"}`}>{enable ? "上架中" : "未上架"}</div>
)

export {ProductEnableCell}
