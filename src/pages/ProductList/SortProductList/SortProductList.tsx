import React from 'react'
import Button from 'src/components/Button'

export default function SortProductList() {
  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='text-sm'>Sắp xếp theo</div>
          <Button className='rounded-sm bg-orange px-3 py-2 text-sm uppercase text-white'>Phổ biến</Button>
          <Button className='rounded-sm bg-white px-3 py-2 text-sm uppercase text-black'>Phổ biến</Button>
          <Button className='rounded-sm bg-white px-3 py-2 text-sm uppercase text-black'>Bán chạy</Button>
          <select className='rounded-sm border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none'>
            <option selected value='' disabled>
              Giá
            </option>
            <option value='price:asc'>Giá: Thấp đến cao</option>
            <option value='price:desc'>Giá: Cao đến thấp</option>
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <div className='text-sm'>
            <span className='text-orange'>1</span>
            <span>/2</span>
          </div>
          <div>
            <Button className='border-spacing-1 cursor-not-allowed border bg-white p-1 opacity-50'>
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
            </Button>
            <Button className='border-spacing-1 border bg-white p-1 '>
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
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
