import { FC, useState } from 'react'
import { FormCheck } from 'react-bootstrap'
import { useFormik } from 'formik'
import { isNotEmpty, toAbsoluteUrl } from '@/_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'

import currentTable from '../globalVariable/currentTable'
import dict from '../dictionary/tableDictionary'
import Stars from '@/components/input/starsRating'
import useInputFilePath from '@/tool/hook/useInputFilePath'
import onlyInputNumbers from '@/tool/inputOnlyNumbers'

const { modalConfig, formField, validationSchema } = dict

type Props = {
  isUserLoading: boolean
  user: User
}

const InputLabel = ({ required, text }) =>
  <label className={clsx('fw-bold fs-6 mb-2', {
    'required': required
  })}>{text}</label>

const ValidateInputField = ({ required = false, label, name, formik, placeholder, inputclassname = "", type = "text", readonly = false, onlynumber = false }) => (
  <>
    <InputLabel required={required} text={label} />
    <input
      {...(required && !readonly ? formik.getFieldProps(name) : {})}
      placeholder={placeholder}
      className={clsx(
        'form-control form-control-solid mb-3 mb-lg-0',
        inputclassname,
        { 'is-invalid': formik?.touched[name] && formik?.errors[name] },
        { 'is-valid': formik?.touched[name] && !formik?.errors[name] }
      )}
      type={type}
      name={name}
      autoComplete='off'
      {...(onlynumber ? {
        onKeyDown: onlyInputNumbers
      } : {})}
      disabled={readonly || formik?.isSubmitting}
    />
    {formik?.touched[name] && formik?.errors[name] && (
      <div className='fv-plugins-message-container'>
        <div className='fv-help-block'>
          <span role='alert'>{formik?.errors[name]}</span>
        </div>
      </div>
    )}
  </>
)

const EditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()
  const tableName = currentTable.get()
  const config = modalConfig[tableName]

  const [mockImg, handleImgChoose] = useInputFilePath()
  const [colorImg, handleColorImgChoose] = useInputFilePath()
  const [avatarSrc, handleAvatarChoose] = useInputFilePath()

  const [userForEdit] = useState<User>({
    ...user,
    avatar: user.avatar || initialUser.avatar,
    role: user.role || initialUser.role,
    position: user.position || initialUser.position,
    name: user.name || initialUser.name,
    email: user.email || initialUser.email,
  })

  const [field] = useState(formField[tableName])

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
    validationSchema: validationSchema[tableName],
    onSubmit: async (values, { setSubmitting }) => {
      console.log("mock submit:", values)
      return cancel()
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
              <label className='d-block fw-bold fs-6 mb-5'>大頭貼照</label>
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
                  style={{ backgroundImage: `url('${avatarSrc || userAvatarImg}')` }}
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

                  <input type='file' name='avatar' accept='.png, .jpg, .jpeg' onInput={handleAvatarChoose} />
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

          {(config.name_label || config.enable_label || config.available_label) &&
            <div className='d-flex mb-7'>
              {config.name_label &&
                <div className='fv-row flex-grow-1'>
                  <ValidateInputField
                    required={config.name_required}
                    name={"name"}
                    label={config.name_label}
                    placeholder={config.name_placeholder || "請輸入"}
                    formik={formik}
                  />
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
          }

          {(config.code_label || config.email) &&
            <div className='d-flex'>
              {config.code_label &&
                <div className='fv-row mb-7 flex-grow-1'>
                  <ValidateInputField
                    required={config.code_required}
                    label={config.code_label}
                    placeholder={'輸入編號'}
                    readonly={config.code_read_only}
                    name={"code"}
                    formik={formik}
                  />
                </div>
              }

              {config.email &&
                <div className='fv-row mb-7 ms-3 flex-grow-1'>
                  <ValidateInputField
                    required={config.email_required}
                    label={"電子郵箱"}
                    type='email'
                    placeholder={'輸入 Email'}
                    name={"email"}
                    formik={formik}
                  />
                </div>
              }
            </div>
          }

          {(config.id_code_label || config.phone_number_label) &&
            <div className='d-flex mb-7'>
              {config.id_code_label &&
                <div className='fv-row flex-grow-1'>
                  <ValidateInputField
                    required={config.id_code_required}
                    label={config.id_code_label}
                    placeholder={config.id_code_placeholder}
                    inputclassname={"text-uppercase"}
                    name={"id_code"}
                    formik={formik}
                  />
                </div>
              }

              {config.phone_number_label &&
                <div className='fv-row flex-grow-1 ms-3'>
                  <ValidateInputField
                    required={config.phone_number_required}
                    label={config.phone_number_label}
                    placeholder={config.phone_number_placeholder}
                    name={"phone_number"}
                    formik={formik}
                    onlynumber
                  />
                </div>
              }
            </div>
          }

          {config.password_label &&
            <div className='fv-row mb-7'>
              <ValidateInputField
                required={config.password_required}
                label={config.password_label}
                placeholder={config.password_placeholder}
                name={"password"}
                formik={formik}
              />
            </div>
          }

          {config.role_label &&
            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.role_label}</label>
              <select
                className={clsx(
                  'form-select form-select-solid mb-3 mb-lg-0'
                )}
                name='role'
                disabled={formik.isSubmitting || isUserLoading}
              >
                <option>OOOXXX</option>
                <option>QXXXQ</option>
                <option>QWQ</option>
              </select>
            </div>
          }

          {(config.style_label || config.series_label) &&
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
          }

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
                  <label className='ms-3 d-block h-100px w-100px cursor-pointer' style={{ aspectRatio: '1' }}>
                    {colorImg ?
                      <img className='h-100px w-100 rounded-4 object-fit-cover' src={colorImg} alt="color image" /> :
                      <div className='flex-center h-100 border border-2 rounded-4 bg-secondary'>新增顏色</div>
                    }
                    <input type="file" accept="image/png, image/jpeg" hidden onChange={handleColorImgChoose} />
                  </label>
                  {(mockImg || colorImg) &&
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

          {config.environment_label &&
            <div className='mb-7'>
              <div className='fw-bold fs-6 mb-2'>{config.environment_label}</div>
              <div className='d-flex flex-wrap justify-content-start'>
                {["OOOXXO", "OOXXYY", "CCVVVV", "SGREYDGH", "OOOYYYO", "OOXUTYUXYY", "CCV",].map((item, index) =>
                  <label key={index} className='me-2 mb-2 tags-label cursor-pointer'>
                    <input type='checkbox' hidden />
                    <div className='fs-4 py-2 px-5 border border-2 rounded-2'>{item}</div>
                  </label>
                )}
              </div>
            </div>
          }

          {config.description_label &&
            <div className='mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.description_label}</label>
              <div>
                <textarea className='w-100 border border-1 border-gray-400 rounded-2 px-4 py-2 fs-3' style={{ minHeight: "120px" }}></textarea>
              </div>
            </div>
          }

          {config.members_label &&
            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.members_label}</label>

              <div className='p-4 border border-gray-400 rounded-2'>
                <p>員工一</p>
                <p>員工二</p>
                <p>員工三</p>
              </div>
            </div>
          }

          {config.auth_label &&
            <div className='mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.auth_label}</label>
              <div>
                {config.auth_list.map((auth, index) =>
                  <FormCheck key={index} label={auth} id={`${config.auth_label}_${auth}`} name={config.auth_label} inline />
                )}
              </div>
            </div>
          }

          {config.comments_label &&
            <div className='mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.comments_label}</label>
              <div>
                <textarea className='w-100 border border-1 border-gray-400 rounded-2 px-4 py-2 fs-3' style={{ minHeight: "120px" }}></textarea>
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
