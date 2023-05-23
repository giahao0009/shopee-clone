import { useQuery } from '@tanstack/react-query'
import { map } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchasesStatus'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

export default function Cart() {
  const { data: purchaseData, error } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.incart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.incart })
  })

  const purchasesInCart: Purchase[] | undefined = purchaseData?.data.data

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input type='checkbox' className='h-5 w-5 accent-orange' />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>
            <div className='my-3 rounded-sm  p-5 shadow'>
              {map(purchasesInCart, (item) => (
                <div
                  key={item._id}
                  className='mb-3 grid grid-cols-12 rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 shadow'
                >
                  <div className='col-span-6'>
                    <div className='flex'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input type='checkbox' className='h-5 w-5 accent-orange' />
                      </div>
                      <div className='flex-grow'>
                        <div className='flex'>
                          <Link
                            to={`${path.home}${generateNameId({ name: item.product.name, id: item.product._id })}`}
                            className='h-20 w-20 flex-shrink-0'
                          >
                            <img alt={item.product.name} src={item.product.image} />
                          </Link>
                          <div className='flex-grow px-2 pb-2 pt-1'>
                            <Link
                              to={`${path.home}${generateNameId({ name: item.product.name, id: item.product._id })}`}
                              className='line-clamp-2'
                            >
                              {item.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>
                        <div className='flex items-center justify-center'>
                          <span className='text-gray-400 line-through'>
                            {formatCurrency(item.product.price_before_discount)}
                          </span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <QuantityController
                          max={item.product.quantity}
                          value={item.buy_count}
                          classNameWrapper='flex items-center'
                        />
                      </div>
                      <div className='col-span-1'>
                        <span className='text-orange'>{formatCurrency(item.price * item.buy_count)}</span>
                      </div>
                      <div className='col-span-1'>
                        <button className='bg-none text-black transition-colors hover:text-orange'>Xoá</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 flex flex-col rounded-sm border border-gray-200 bg-white p-5 shadow sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input type='checkbox' className='h-5 w-5 accent-orange' />
            </div>
            <button className='mx-3 border-none bg-none outline-none'>Chọn tất cả</button>
            <button className='mx-3 border-none bg-none outline-none'>Xoá</button>
          </div>

          <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
            <div>
              <div className='flex items-center sm:justify-end'>
                <div>Tổng thanh toán (0 sản phẩm):</div>
                <div className='text-2xl text-orange sm:ml-2'>đ 138000</div>
              </div>
              <div className='flex items-center text-sm sm:justify-end'>
                <div className='text-gray-500'>Tiết kiệm:</div>
                <div className='text-orange sm:ml-6'>đ 138000</div>
              </div>
            </div>
            <Button className='mt-2 h-10 w-full rounded bg-orange text-white shadow hover:opacity-90 sm:ml-2 sm:mt-0 sm:w-48'>
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
