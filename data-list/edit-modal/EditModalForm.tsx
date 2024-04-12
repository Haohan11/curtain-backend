import { useState, useEffect } from 'react'

import Image from 'next/image'

import { FormCheck } from 'react-bootstrap'
import { useFormik } from 'formik'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { useTableData } from '../core/tableDataProvider'

import currentTable from '../globalVariable/currentTable'
import dict from '../dictionary/tableDictionary'
import Stars from '@/components/input/starsRating'
import { useInputFilePath, useGroupInputFilePath } from '@/tool/hooks'
import onlyInputNumbers from '@/tool/inputOnlyNumbers'

import { createDataRequest, updateDataRequest, getDataByTable } from '../core/request'

const { modalConfig, formField, validationSchema } = dict

const InputLabel = ({ required, text }) =>
  <label className={clsx('fw-bold fs-6 mb-2', {
    'required': required
  })}>{text}</label>

const ValidateInputField = ({ required = false, label, name, formik, placeholder, inputclassname = "", type = "text", readonly = false, onlynumber = false }) => (
  <>
    <InputLabel required={required} text={label} />
    <input
      {...formik.getFieldProps(name)}
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

const EditModalForm = ({ isUserLoading }) => {
  const { setItemIdForUpdate, itemIdForUpdate } = useListView()
  const tableName = currentTable.get()
  const config = modalConfig[tableName]
  const { tableData, setTableData } = useTableData()

  const currentData = itemIdForUpdate ? tableData.find(data => data.id === itemIdForUpdate) : null

  const [colorImagePathGroup, handleImageChoose] = useGroupInputFilePath()
  const colorImageLength = colorImagePathGroup.length

  const [series, setSeries] = useState([])
  const seriesIsEmpty = series.length === 0

  const [supplier, setSupplier] = useState([])
  const supplierIsEmpty = supplier.length === 0

  const [colorScheme, setColorScheme] = useState([])
  const colorSchemeIsEmpty = colorScheme.length === 0

  const [material, setMaterial] = useState([])
  const materialIsEmpty = material.length === 0

  const [design, setDesign] = useState([])
  const designIsEmpty = design.length === 0

  const [environment, setEnvironment] = useState([])
  const environmentIsEmpty = environment.length === 0

  const [avatarSrc, handleAvatarChoose] = useInputFilePath()

  const cancel = () => {
    setItemIdForUpdate(undefined)
  }

  const [initialValues, setInitialValues] = useState({ ...formField[tableName], ...(currentData === null ? {} : currentData) })

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema[tableName],
    onSubmit: async (values) => {
      if (itemIdForUpdate === undefined) return

      if (itemIdForUpdate === null) {
        await createDataRequest(values)
        return cancel()
      }

      const result = await updateDataRequest({ ...values, id: itemIdForUpdate })
      if (result !== false) {
        setTableData(prev => prev.map(data => data.id === itemIdForUpdate ? { ...data, ...values, password: "" } : data))
      }
      cancel()
    }
  })

  useEffect(() => {
    (async () => {
      if (config.series_label) {
        const { data: list } = await getDataByTable("series")
        const enableList = list.filter(item => item.enable)
        setSeries(enableList)
      }

      if (config.supplier_label) {
        const { data: list } = await getDataByTable("supplier")
        const enableList = list.filter(item => item.enable)
        setSupplier(enableList)
      }

      if (config.color_label) {
        const { data: list } = await getDataByTable("colorScheme")
        const enableList = list.filter(item => item.enable)
        setColorScheme(enableList)
      }

      if (config.material_label) {
        const { data: list } = await getDataByTable("material")
        const enableList = list.filter(item => item.enable)
        setMaterial(enableList)
      }

      if (config.design_label) {
        const { data: list } = await getDataByTable("design")
        const enableList = list.filter(item => item.enable)
        setDesign(enableList)
      }

      if (config.environment_label) {
        const { data: list } = await getDataByTable("environment")
        const enableList = list.filter(item => item.enable)
        setEnvironment(enableList)
      }
    })()
  }, [])

  // re assign inital value with keep old input fields values
  useEffect(() => {
    setInitialValues(prev => ({
      ...prev, 
      ...([...Array(parseInt(colorImagePathGroup.length / 2) + 1)].reduce((dict, path, index) => {
        dict[`color_${index}`] = formik.values[`color_${index}`] || ""
        dict[`colorScheme_${index}`] = formik.values[`colorScheme_${index}`] || colorScheme[0]?.id || ""
        return dict
      }, {})),
      series: series[0]?.id || ""
    }))
  }, [colorImagePathGroup, colorScheme, series])

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
              >
                {/* begin::Preview existing avatar */}
                <div
                  className='image-input-wrapper w-125px h-125px'
                  style={{ backgroundImage: `url('${avatarSrc}')` }}
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
                    name="name"
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
                    {...formik.getFieldProps(config.enable_label ? "enable" : "available")}
                    inline
                    type='switch'
                    defaultChecked={currentData === null ? formik.getFieldProps(config.enable_label ? "enable" : "available").value : currentData[config.enable_label ? "enable" : "available"]}
                    id='available-switch'
                    name={config.enable_label ? "enable" : "available"}
                    className={"ms-2"}
                    disabled={formik.isSubmitting || isUserLoading}
                  />
                </div>
              }
            </div>
          }

          {(config.code_label || config.email || config.series_label) &&
            <div className='d-flex'>
              {config.code_label &&
                <div className='fv-row mb-7 flex-grow-1'>
                  <ValidateInputField
                    required={config.code_required}
                    label={config.code_label}
                    placeholder={config.code_placeholder || '輸入編號'}
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

              {config.series_label &&
                <div className='fv-row flex-grow-1 ms-5'>
                  <label className='fw-bold fs-6 mb-2'>{config.series_label}</label>
                  <select
                    {...formik.getFieldProps("series")}
                    className={clsx(
                      'form-select form-select-solid mb-3 mb-lg-0'
                    )}
                    name='series'
                    disabled={formik.isSubmitting || isUserLoading}
                  >
                    {seriesIsEmpty ? <option disabled>目前沒有資料</option> : series.map(item =>
                      <option key={item.id} value={item.id}>{item.name}</option>
                    )}
                  </select>
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

          {config.supplier_label &&
            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.supplier_label}</label>

              <select
                {...formik.getFieldProps("supplier")}
                className={clsx(
                  'form-select form-select-solid mb-3 mb-lg-0'
                )}
                name='supplier'
                disabled={formik.isSubmitting || isUserLoading}
              >
                {supplierIsEmpty ? <option disabled>目前沒有資料</option> : supplier.map(item =>
                  <option key={item.id} value={item.id}>{item.name}</option>
                )}
              </select>
            </div>
          }

          {config.color_label &&
            <div className='fv-row mb-7'>
              <div className='fw-bold fs-6 mb-2'>{config.color_label}</div>
              <div className='row row-cols-2 gy-4'>
                {[...Array(parseInt(colorImagePathGroup.length / 2) + (colorImageLength <= 1 ? 1 : colorImagePathGroup[colorImageLength - 2] ? 1 : 0))].map((_, index) =>
                  <div key={index} className='d-flex'>
                    <label className='d-block h-100px w-100px cursor-pointer position-relative' style={{ aspectRatio: '1' }}>
                      {colorImagePathGroup[2 * index] ?
                        <Image className='rounded-4 object-fit-cover' fill src={colorImagePathGroup[2 * index]} alt="color image" /> :
                        <div className='flex-center h-100 border border-2 rounded-4 bg-secondary'>商品圖片</div>
                      }
                      <input type="file" accept=".png, .jpg, .jpeg" hidden onChange={(event) => handleImageChoose(event, 2 * index)} />
                    </label>
                    <label className='ms-3 d-block h-100px w-100px cursor-pointer position-relative' style={{ aspectRatio: '1' }}>
                      {colorImagePathGroup[2 * index + 1] ?
                        <Image className='rounded-4 object-fit-cover' fill src={colorImagePathGroup[2 * index + 1]} alt="color image" /> :
                        <div className='flex-center h-100 border border-2 rounded-4 bg-secondary'>顏色圖片</div>
                      }
                      <input type="file" accept=".png, .jpg, .jpeg" hidden onChange={event => handleImageChoose(event, 2 * index + 1)} />
                    </label>
                    {(colorImagePathGroup[2 * index] || colorImagePathGroup[2 * index + 1]) &&
                      <div className='ms-3'>
                        <input
                          {...formik.getFieldProps(`color_${index}`)}
                          className={clsx(
                            'form-control form-control-solid mb-3'
                          )}
                          type='text'
                          name={`color_${index}`}
                          autoComplete='off'
                          disabled={formik.isSubmitting || isUserLoading}
                        />
                        <select
                          {...formik.getFieldProps(`colorScheme_${index}`)}
                          className={clsx(
                            'form-select form-select-solid'
                          )}
                          name={`colorScheme_${index}`}
                          disabled={formik.isSubmitting || isUserLoading}
                        >
                          {colorSchemeIsEmpty ? <option disabled>目前沒有資料</option> : colorScheme.map(item =>
                            <option key={item.id} value={item.id}>{item.name}</option>
                          )}
                        </select>
                      </div>
                    }
                  </div>
                )}
              </div>
            </div>
          }

          {config.material_label &&
            <div className='mb-7'>
              <div className='fw-bold fs-6 mb-2'>{config.material_label}</div>
              <div className='d-flex flex-wrap justify-content-start'>
                {materialIsEmpty ? <div className='w-100 text-center bg-secondary p-2 rounded-2'>目前沒有資料</div> : material.map((item) =>
                  <label key={item.id} className='me-2 mb-2 tags-label cursor-pointer'>
                    <input
                      {...formik.getFieldProps("material")}
                      type='checkbox' name='material' value={item.name} hidden />
                    <div className='fs-4 py-2 px-5 border border-2 rounded-2'>{item.name}</div>
                  </label>
                )}
              </div>
            </div>
          }

          {config.design_label &&
            <div className='mb-7'>
              <div className='fw-bold fs-6 mb-2'>{config.design_label}</div>
              <div className='d-flex flex-wrap justify-content-start'>
                {designIsEmpty ? <div className='w-100 text-center bg-secondary p-2 rounded-2'>目前沒有資料</div> : design.map((item) =>
                  <label key={item.id} className='me-2 mb-2 tags-label cursor-pointer'>
                    <input
                      {...formik.getFieldProps("material")}
                      type='checkbox' name='design' value={item.name} hidden />
                    <div className='fs-4 py-2 px-5 border border-2 rounded-2'>{item.name}</div>
                  </label>
                )}
              </div>
            </div>
          }

          {config.absorption_label &&
            <div className='row mb-7'>
              <div className='col'>
                <label className='fw-bold fs-6 mb-2'>{config.absorption_label}</label>
                <Stars
                  {...formik.getFieldProps("absorption")}
                  width={50} name="absorption" />
              </div>
              <div className='col'>
                <label className='fw-bold fs-6 mb-2'>{config.block_label}</label>
                <Stars 
                  {...formik.getFieldProps("block")}
                  width={50} name="block" />
              </div>
            </div>
          }

          {config.environment_label &&
            <div className='mb-7'>
              <div className='fw-bold fs-6 mb-2'>{config.environment_label}</div>
              <div className='d-flex flex-wrap justify-content-start'>
              {environmentIsEmpty ? <div className='w-100 text-center bg-secondary p-2 rounded-2'>目前沒有資料</div> : environment.map((item) =>
                  <label key={item.id} className='me-2 mb-2 tags-label cursor-pointer'>
                    <input
                      {...formik.getFieldProps("environment")}
                      type='checkbox' name='environment' value={item.name} hidden />
                    <div className='fs-4 py-2 px-5 border border-2 rounded-2'>{item.name}</div>
                  </label>
                )}
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
                <textarea className='w-100 border border-1 border-gray-400 rounded-2 px-4 py-2 fs-3' style={{ minHeight: "120px" }} {...formik.getFieldProps("description")}></textarea>
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

          {config.comment_label &&
            <div className='mb-7'>
              <label className='fw-bold fs-6 mb-2'>{config.comment_label}</label>
              <div>
                <textarea className='w-100 border border-1 border-gray-400 rounded-2 px-4 py-2 fs-3' style={{ minHeight: "120px" }} {...formik.getFieldProps("comment")} name='comment'></textarea>
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
      {/*(formik.isSubmitting || isUserLoading) && <UsersListLoading />*/}
    </>
  )
}

export { EditModalForm }
