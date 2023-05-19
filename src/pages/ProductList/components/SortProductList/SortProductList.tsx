import classNames from 'classnames'
import Button from 'src/components/Button'
import { QueryConfig } from '../../ProductList'
import { ProductListConfig } from 'src/types/product.type'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { omit } from 'lodash'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const { sort_by = 'createdAt', order } = queryConfig
  const navigate = useNavigate()

  // Tạo function để check active
  // Exclude là một function bên TS sẽ loại bỏ undefince của một thuộc tính trong 1 type
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString() //Đồng bộ lên phía URL
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: 'price',
        order: orderValue
      }).toString() // Đồng bộ lên phía URL
    })
  }

  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='text-sm'>Sắp xếp theo</div>
          <Button
            onClick={() => handleSort('view')}
            className={classNames('uppercas rounded-s px-3 py-2 text-sm', {
              'bg-orange text-white': isActiveSortBy('view'),
              'bg-white text-black': !isActiveSortBy('view')
            })}
          >
            Phổ biến
          </Button>
          <Button
            onClick={() => handleSort('createdAt')}
            className={classNames('uppercas rounded-s px-3 py-2 text-sm', {
              'bg-orange text-white': isActiveSortBy('createdAt'),
              'bg-white text-black': !isActiveSortBy('createdAt')
            })}
          >
            Mới nhất
          </Button>
          <Button
            onClick={() => handleSort('sold')}
            className={classNames('uppercas rounded-s px-3 py-2 text-sm', {
              'bg-orange text-white': isActiveSortBy('sold'),
              'bg-white text-black': !isActiveSortBy('sold')
            })}
          >
            Bán chạy
          </Button>
          <select
            className={classNames('rounded-sm border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy('price'),
              'bg-white text-black hover:bg-white/80': !isActiveSortBy('price')
            })}
            value={order || ''} // Nếu không có order thì ta show option giá
            onChange={(event) => handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option selected value='' disabled className='bg-white text-black'>
              Giá
            </option>
            <option value='asc' className='bg-white text-black'>
              Giá: Thấp đến cao
            </option>
            <option value='desc' className='bg-white text-black'>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <div className='text-sm'>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div>
            {page === 1 ? (
              <span className='inline-block border-spacing-1 cursor-not-allowed border bg-gray-100 p-1 opacity-50'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({ ...queryConfig, page: (page - 1).toString() }).toString()
                }}
                className='inline-block border-spacing-1 border bg-white p-1'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className='inline-block border-spacing-1 cursor-not-allowed border bg-gray-100 p-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({ ...queryConfig, page: (page + 1).toString() }).toString()
                }}
                className='inline-block border-spacing-1 border bg-white p-1'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
