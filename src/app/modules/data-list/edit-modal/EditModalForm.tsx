import { FC, useState } from 'react'
import * as Yup from 'yup'
import { FormCheck } from 'react-bootstrap'
import { useFormik } from 'formik'
import { isNotEmpty, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'

import { useTableData } from '../core/TableDataProvider'
import dict from '../dictionary/tableDictionary'

import Stars from '../../../../components/starsRating'

const { modalConfig, formField } = dict

type Props = {
  isUserLoading: boolean
  user: User
}

const editUserSchema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Wrong email format')
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('Email is required'),
  name: Yup.string()
    .min(3, '至少 3 個字')
    .max(50, '至多 50 個字')
    .required('此欄位必填'),
})

const EditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()
  const { table } = useTableData()
  const config = modalConfig[table]

  const [mockImg, setMockImg] = useState(null)

  const handleImgChoose = (event) => {
    const [file] = event.target.files
    if (!file) return
    setMockImg(URL.createObjectURL(file))
  }

  const [userForEdit] = useState<User>({
    ...user,
    avatar: user.avatar || initialUser.avatar,
    role: user.role || initialUser.role,
    position: user.position || initialUser.position,
    name: user.name || initialUser.name,
    email: user.email || initialUser.email,
  })

  const [field] = useState(formField[table])

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('media/svg/avatars/blank.svg')
  const userAvatarImg = toAbsoluteUrl(`media/${userForEdit.avatar}`)

  const formik = useFormik({
    initialValues: field,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      return console.log("mock submit:", values)
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y-auto'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          {config.avatar &&
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='d-block fw-bold fs-6 mb-5'>Avatar</label>
              {/* end::Label */}

              {/* begin::Image input */}
              <div
                className='image-input image-input-outline'
                data-kt-image-input='true'
                style={{ backgroundImage: `url('${blankImg}')` }}
              >
                {/* begin::Preview existing avatar */}
                <div
                  className='image-input-wrapper w-125px h-125px'
                  style={{ backgroundImage: `url('${userAvatarImg}')` }}
                ></div>
                {/* end::Preview existing avatar */}

                {/* begin::Label */}
                <label
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='change'
                  data-bs-toggle='tooltip'
                  title='Change avatar'
                >
                  <i className='bi bi-pencil-fill fs-7'></i>

                  <input type='file' name='avatar' accept='.png, .jpg, .jpeg' />
                  <input type='hidden' name='avatar_remove' />
                </label>
                {/* end::Label */}
              </div>
              {/* end::Image input */}

              {/* begin::Hint */}
              {/* <div className='form-text'>Allowed file types: png, jpg, jpeg.</div> */}
              {/* end::Hint */}
            </div>
          }

          <div className='d-flex mb-7'>
            {config.name_label &&
              <div className='fv-row flex-grow-1'>
                {/* begin::Label */}
                <label className='required fw-bold fs-6 mb-2'>{config.name_label}</label>
                {/* end::Label */}

                {/* begin::Input */}
                <input
                  placeholder={config.name_placeholder || "請輸入"}
                  {...formik.getFieldProps('name')}
                  type='text'
                  name='name'
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    { 'is-invalid': formik.touched.name && formik.errors.name },
                    {
                      'is-valid': formik.touched.name && !formik.errors.name,
                    }
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.name}</span>
                    </div>
                  </div>
                )}
                {/* end::Input */}
              </div>
            }
            {(config.enable_label || config.available_label) &&
              <div className='fv-row ms-5 flex-grow-1 align-self-center text-end'>
                <label htmlFor='available-switch' className='fw-bold fs-6 mb-2 cursor-pointer'>
                  {config.enable_label || config.available_label}
                </label>

                <FormCheck
                  inline
                  type='switch'
                  id='available-switch'
                  name='name'
                  className={"ms-2"}
                  disabled={formik.isSubmitting || isUserLoading}
                />
              </div>
            }
          </div>

          {config.email &&
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>電子郵箱</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Email'
                {...formik.getFieldProps('email')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.email && formik.errors.email },
                  {
                    'is-valid': formik.touched.email && !formik.errors.email,
                  }
                )}
                type='email'
                name='email'
                autoComplete='off'
                disabled={formik.isSubmitting || isUserLoading}
              />
              {/* end::Input */}
              {formik.touched.email && formik.errors.email && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              )}
            </div>
          }

          {/* begin:: style and series */}
          <div className='d-flex mb-7'>
            {config.style_label &&
              <div className='fv-row flex-grow-1'>
                <label className='fw-bold fs-6 mb-2'>{config.style_label}</label>
                <input
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0'
                  )}
                  type='text'
                  name='style'
                  autoComplete='off'
                  disabled={formik.isSubmitting || isUserLoading}
                />
              </div>
            }

            {config.series_label &&
              <div className='fv-row flex-grow-1 ms-5'>
                <label className='fw-bold fs-6 mb-2'>{config.series_label}</label>
                <select
                  className={clsx(
                    'form-select form-select-solid mb-3 mb-lg-0'
                  )}
                  name='series'
                  disabled={formik.isSubmitting || isUserLoading}
                >
                  <option>遮光簾</option>
                </select>
              </div>
            }
          </div>
          {/* end:: style and series */}

          {config.vendor_label &&
            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.vendor_label}</label>

              <select
                className={clsx(
                  'form-select form-select-solid mb-3 mb-lg-0'
                )}
                name='vendor'
                disabled={formik.isSubmitting || isUserLoading}
              >
                <option>OOOXXX</option>
              </select>
            </div>
          }

          {config.color_label &&
            <div className='fv-row mb-7'>
              <div className='fw-bold fs-6 mb-2'>{config.color_label}</div>
              <div className='row row-cols-2 gy-4'>
                <div className='col d-flex align-items-center'>
                  <label className='d-block h-100px w-100px cursor-pointer' style={{ aspectRatio: '1' }}>
                    {mockImg ?
                      <img className='h-100px w-100 rounded-4 object-fit-cover' src={mockImg} alt="color image" /> :
                      <div className='flex-center h-100 border border-2 rounded-4 bg-secondary'>新增顏色</div>
                    }
                    <input type="file" accept="image/png, image/jpeg" hidden onChange={handleImgChoose} />
                  </label>
                  {mockImg &&
                    <div className='ms-3'>
                      <input
                        className={clsx(
                          'form-control form-control-solid mb-3'
                        )}
                        type='text'
                        name='color'
                        autoComplete='off'
                        disabled={formik.isSubmitting || isUserLoading}
                      />
                      <select
                        className={clsx(
                          'form-select form-select-solid'
                        )}
                        name='colorScheme'
                        disabled={formik.isSubmitting || isUserLoading}
                      >
                        <option>色系類別</option>
                      </select>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          {config.material_label &&
            <div className='mb-7'>
              <div className='fw-bold fs-6 mb-2'>{config.material_label}</div>
              <div className='d-flex flex-wrap justify-content-start'>
                {["OOOXXO", "OOXXYY", "布的", "紙的", "CCVVVV", "SGREYDGH", "OOOYYYO", "OOXUTYUXYY", "布布的", "紙布布的", "CCV",].map((item, index) =>
                  <label key={index} className='me-2 mb-2 tags-label cursor-pointer'>
                    <input type='checkbox' hidden />
                    <div className='fs-4 py-2 px-5 border border-2 rounded-2'>{item}</div>
                  </label>
                )}
              </div>
            </div>
          }

          {config.design_label &&
            <div className='mb-7'>
              <div className='fw-bold fs-6 mb-2'>{config.design_label}</div>
              <div className='d-flex flex-wrap justify-content-start'>
                {["OOOXXO", "OOXXYY", "布的", "紙的", "CCVVVV", "SGREYDGH", "OOOYYYO", "OOXUTYUXYY", "布布的", "紙布布的", "CCV",].map((item, index) =>
                  <label key={index} className='me-2 mb-2 tags-label cursor-pointer'>
                    <input type='checkbox' hidden />
                    <div className='fs-4 py-2 px-5 border border-2 rounded-2'>{item}</div>
                  </label>
                )}
              </div>
            </div>
          }


          {config.absorption_label &&
            <div className='row mb-7'>
              <div className='col'>
                <label className='fw-bold fs-6 mb-2'>{config.absorption_label}</label>
                <Stars width={50} name="absorption" />
              </div>
              <div className='col'>
                <label className='fw-bold fs-6 mb-2'>{config.block_label}</label>
                <Stars width={50} name="block" />
              </div>
            </div>
          }

          {config.description_label &&
            <div className='mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.description_label}</label>
              <div>
                <textarea rows="5" className='w-100 border border-2 border-gray-300 px-4 py-2 fs-3' style={{ minHeight: "180px" }}></textarea>
              </div>
            </div>
          }

          {config.comments_label &&
            <div className='mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.comments_label}</label>
              <div>
                <textarea rows="5" className='w-100 border border-2 border-gray-300 px-4 py-2 fs-3' style={{ minHeight: "180px" }}></textarea>
              </div>
            </div>
          }

          {config.role &&
            <div className='mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-5'>Role</label>
              {/* end::Label */}
              {/* begin::Roles */}
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...formik.getFieldProps('role')}
                    name='role'
                    type='radio'
                    value='Administrator'
                    id='kt_modal_update_role_option_0'
                    checked={formik.values.role === 'Administrator'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />

                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                    <div className='fw-bolder text-gray-800'>Administrator</div>
                    <div className='text-gray-600'>
                      Best for business owners and company administrators
                    </div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...formik.getFieldProps('role')}
                    name='role'
                    type='radio'
                    value='Developer'
                    id='kt_modal_update_role_option_1'
                    checked={formik.values.role === 'Developer'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                    <div className='fw-bolder text-gray-800'>Developer</div>
                    <div className='text-gray-600'>
                      Best for developers or people primarily using the API
                    </div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...formik.getFieldProps('role')}
                    name='role'
                    type='radio'
                    value='Analyst'
                    id='kt_modal_update_role_option_2'
                    checked={formik.values.role === 'Analyst'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />

                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_2'>
                    <div className='fw-bolder text-gray-800'>Analyst</div>
                    <div className='text-gray-600'>
                      Best for people who need full access to analytics data, but don't need to update
                      business settings
                    </div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...formik.getFieldProps('role')}
                    name='role'
                    type='radio'
                    value='Support'
                    id='kt_modal_update_role_option_3'
                    checked={formik.values.role === 'Support'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_3'>
                    <div className='fw-bolder text-gray-800'>Support</div>
                    <div className='text-gray-600'>
                      Best for employees who regularly refund payments and respond to disputes
                    </div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              <div className='separator separator-dashed my-5'></div>
              {/* begin::Input row */}
              <div className='d-flex fv-row'>
                {/* begin::Radio */}
                <div className='form-check form-check-custom form-check-solid'>
                  {/* begin::Input */}
                  <input
                    className='form-check-input me-3'
                    {...formik.getFieldProps('role')}
                    name='role'
                    type='radio'
                    id='kt_modal_update_role_option_4'
                    value='Trial'
                    checked={formik.values.role === 'Trial'}
                    disabled={formik.isSubmitting || isUserLoading}
                  />
                  {/* end::Input */}
                  {/* begin::Label */}
                  <label className='form-check-label' htmlFor='kt_modal_update_role_option_4'>
                    <div className='fw-bolder text-gray-800'>Trial</div>
                    <div className='text-gray-600'>
                      Best for people who need to preview content data, but don't need to make any
                      updates
                    </div>
                  </label>
                  {/* end::Label */}
                </div>
                {/* end::Radio */}
              </div>
              {/* end::Input row */}
              {/* end::Roles */}
            </div>
          }
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-secondary me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            取消
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>確認</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { EditModalForm }
