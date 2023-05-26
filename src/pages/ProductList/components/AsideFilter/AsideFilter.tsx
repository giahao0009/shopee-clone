import classNames from 'classnames'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'
import { QueryConfig } from '../../ProductList'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from 'src/types/utils.type'
import RatingStar from '../RatingStar'
import { omit } from 'lodash'
import InputV2 from 'src/components/InputV2'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_min' | 'price_max'>>

/*
  Rule validate input number
  Nếu có price_min và price_max thì price_max >= price_min
  Còn không thì có price_min thì không có price_max và ngược lại
*/

const priceSchema = schema.pick(['price_min', 'price_max']) // Dùng pick để lấy ra các rules

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { category } = queryConfig

  // Sử dụng control để quản lý form filter theo giá mà không cần dùng register
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    // Set default value cho form
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false // Tắt chế độ auto forcus khi gặp lỗi, chỉ hiệu nghiệm khi truyền ref vào element
  })

  const isActiveCategory = (categoryId: string) => {
    return categoryId === category
  }

  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home.link,
      search: createSearchParams({ ...queryConfig, price_max: data.price_max, price_min: data.price_min }).toString()
    })
  })

  const handleRemoveAll = () => {
    const searchParam = createSearchParams(
      omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])
    ).toString()

    navigate({
      pathname: path.home.link,
      search: searchParam
    })
  }

  return (
    <div className='py-4'>
      <Link to={path.home.link} className='flex items-center font-bold'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6- mr-3 h-6 fill-current'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <ul>
        {categories &&
          categories.map((item) => (
            <li className='py-2 pl-2' key={item._id}>
              <Link
                to={{
                  pathname: path.home.link,
                  search: createSearchParams({ ...queryConfig, category: item._id }).toString()
                }}
                className={classNames('relative px-2', {
                  'font-semibold text-orange': isActiveCategory(item._id),
                  'text-black': !isActiveCategory(item._id)
                })}
              >
                <svg
                  viewBox='0 0 4 7'
                  className={classNames('absolute left-[-10px] top-1 h-2 w-2', {
                    'fill-orange': isActiveCategory(item._id),
                    'fill-black': !isActiveCategory(item._id)
                  })}
                >
                  <polygon points='4 3.5 0 0 0 7'></polygon>
                </svg>
                {item.name}
              </Link>
            </li>
          ))}
      </ul>
      <Link to={path.home.link} className='mt-4 flex items-center font-bold'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6- mr-3 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z'
          />
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoản giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            {/* Ta bọc input vào Controller của react-hook-form để quản lý Input Number */}
            {/* <Controller
              control={control}
              name='price_min'
              // truyền vào props render để render ra InputNumber
              // Trong props này sẽ trả ra field và từ field ta có thể lấy ra sự kiện onChange của input để gán giá trị
              // Cũng như ta có thể lấy value ra
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    classNameError='hidden'
                    name='from'
                    placeholder='₫ TỪ'
                    classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max') // Nó sẽ validate lại price_max
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            /> */}

            <InputV2
              control={control}
              name='price_min'
              type='number'
              className='grow'
              placeholder='₫ TỪ'
              classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500'
              onChange={() => {
                trigger('price_max') // Nó sẽ validate lại price_max
              }}
            />

            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    name='to'
                    placeholder='₫ ĐẾN'
                    classNameError='hidden'
                    classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min') // Nó sẽ validate lại price_min
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <button type='submit' className='w-full bg-orange p-2 uppercase text-white hover:opacity-90'>
            Áp dụng
          </button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-sm'>Đánh giá</div>
      <RatingStar queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button onClick={handleRemoveAll} className='w-full bg-orange p-2 text-sm uppercase text-white hover:opacity-90'>
        Xoá tất cả
      </Button>
    </div>
  )
}
