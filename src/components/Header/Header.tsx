import { useQuery } from '@tanstack/react-query'
import { map, take } from 'lodash'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchasesStatus'
import { AppContext } from 'src/contexts/app.context'
import { Purchase } from 'src/types/purchase.type'
import Logo from '../Logo'
import Popover from '../Popover'
import nodata from 'src/assets/images/cart_nodata.jpg'
import { formatCurrency } from 'src/utils/utils'
import NavHeader from '../NavHeader'
import useSearchProduct from 'src/hooks/useSearchProduct'

const MAX_PRODUCT_CART_LIST = 5

export default function Header() {
  const { isAuthenticated } = useContext(AppContext)
  const { register, onSubmitSearch } = useSearchProduct()
  const navigate = useNavigate()

  // Khi chúng ta chuyển trang thì header chỉ bị re-render chứ không bị unmount- mounting again
  // Trừ trường hợp logout nhảy sang register layout nhảy vào lại
  // Nên các query sẽ không bị inactive => Không bị gọi lại => không cần thiết phải set stale: infinitive
  const { data: purchaseData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.incart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.incart }),
    enabled: isAuthenticated // Nếu chưa đăng nhập thì sẽ không gọi API
  })

  const purchasesInCart: Purchase[] | undefined = purchaseData?.data.data

  return (
    <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2'>
      <div className='container'>
        <NavHeader />
        <div className='mt-4 grid grid-cols-12 items-center gap-4 self-center'>
          <Link to='/' className='col-span-2'>
            <Logo color='fill-white' />
          </Link>
          <form className='col-span-9 w-full' onSubmit={onSubmitSearch}>
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                {...register('name')}
                placeholder='Freeship đơn từ 0 đồng'
                className='text-black-none flex-grow border bg-transparent px-3 py-2 outline-none'
              />
              <button className='flex-shrink-0 rounded-sm bg-orange px-6 py-2 hover:opacity-90'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6 text-white'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className='col-span-1 justify-self-end'>
            <Popover
              renderPopover={
                <div className='flex max-w-[400px] flex-col rounded-sm bg-white px-3 py-2 text-sm shadow-lg'>
                  {purchasesInCart && purchasesInCart.length > 0 ? (
                    <div className='p-2'>
                      <div className='capitalize text-stone-500'>Sản phẩm mới thêm</div>
                      <div className='mt-5'>
                        {map(take(purchasesInCart, MAX_PRODUCT_CART_LIST), (item) => (
                          <div className='mt-2 flex cursor-pointer p-1 hover:bg-gray-100' key={item._id}>
                            <div className='flex-shrink-0'>
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className='h-10 w-10 object-cover'
                              />
                            </div>
                            <div className='ml-2 flex-grow overflow-hidden'>
                              <div className='truncate'>{item.product.name}</div>
                            </div>
                            <div className='ml-2 flex-shrink-0'>
                              <div className='text-orange'>{formatCurrency(item.product.price)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='mt-6 flex items-center justify-between'>
                        <div className='text-xs capitalize text-stone-500'>
                          {purchasesInCart.length} Thêm hàng vào giỏ
                        </div>
                        <button
                          onClick={() => navigate({ pathname: path.cart.link })}
                          className='cursor-pointer rounded-sm bg-orange px-3 py-2 capitalize text-white hover:bg-opacity-90'
                        >
                          Xem giỏ hàng
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className='relative flex h-[300px] w-[300px] flex-col items-center justify-center p-3'>
                      <img src={nodata} alt='no product' className='h-full w-full' />
                      <div className='absolute bottom-0 mt-3 text-lg capitalize'>Chưa có sản phẩm</div>
                    </div>
                  )}
                </div>
              }
            >
              <Link to='/cart' className='relative'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-8 w-8 text-white'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                {purchasesInCart && purchasesInCart.length > 0 && (
                  <span className='absolute -right-1 -top-1 rounded-full bg-white px-1 py-0 text-xs text-orange'>
                    {purchasesInCart?.length}
                  </span>
                )}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
