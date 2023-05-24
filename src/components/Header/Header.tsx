import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omit, map, take } from 'lodash'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import purchaseApi from 'src/apis/purchase.api'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchasesStatus'
import { AppContext } from 'src/contexts/app.context'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Purchase } from 'src/types/purchase.type'
import { schema, Schema } from 'src/utils/rules'
import Logo from '../Logo'
import Popover from '../Popover'
import nodata from 'src/assets/images/cart_nodata.jpg'
import { formatCurrency } from 'src/utils/utils'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])
const MAX_PRODUCT_CART_LIST = 5

export default function Header() {
  const queryClient = useQueryClient()
  const { setAuthenticatied, isAuthenticated, profile } = useContext(AppContext)
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const logoutMutation = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setAuthenticatied(false)
      // Clear data giỏ hàng khi đăng xuất
      queryClient.invalidateQueries(['purchases', { status: purchasesStatus.incart }])
    }
  })

  // Khi chúng ta chuyển trang thì header chỉ bị re-render chứ không bị unmount- mounting again
  // Trừ trường hợp logout nhảy sang register layout nhảy vào lại
  // Nên các query sẽ không bị inactive => Không bị gọi lại => không cần thiết phải set stale: infinitive
  const enableRefetch = true
  const { data: purchaseData, error } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.incart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.incart }),
    enabled: isAuthenticated // Nếu chưa đăng nhập thì sẽ không gọi API
  })

  const purchasesInCart: Purchase[] | undefined = purchaseData?.data.data

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const onSubmitSearch = handleSubmit(
    (data) => {
      navigate({
        pathname: path.home,
        search: createSearchParams(omit({ ...queryConfig, name: data.name }, ['order'])).toString()
      })
    },
    (_) => {
      navigate({
        pathname: path.home,
        search: createSearchParams(omit({ ...queryConfig }, ['name'])).toString()
      })
    }
  )

  return (
    <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] pb-5 pt-2'>
      <div className='container'>
        <div className='flex justify-end'>
          <Popover
            className='flex cursor-pointer items-center py-1 text-white hover:text-gray-300'
            renderPopover={
              <div className='flex flex-col rounded-sm bg-white px-3 py-2 shadow-md'>
                <button className='bg-white px-3 py-2 text-black hover:text-orange'>Tiếng Việt</button>
                <button className='bg-white px-3 py-2 text-black hover:text-orange'>Tiếng Anh</button>
              </div>
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-5 w-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
              />
            </svg>
            <span className='mx-1'>Tiếng Việt</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-5 w-5'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
            </svg>
          </Popover>

          {!isAuthenticated ? (
            <div className='flex items-center'>
              <Link to={path.register} className='mx-3 capitalize text-white hover:cursor-pointer hover:opacity-80'>
                Đăng ký
              </Link>
              <div className='h-4 border-r-[1px] border-r-white/40' />
              <Link to={path.login} className='mx-3 capitalize text-white hover:cursor-pointer hover:opacity-80 '>
                Đăng nhập
              </Link>
            </div>
          ) : (
            <Popover
              className='ml-6 flex cursor-pointer items-center py-1 text-white hover:text-gray-300'
              renderPopover={
                <div className='flex flex-col rounded-sm bg-white shadow-md'>
                  <Link to='/' className='block px-3 py-2 hover:bg-[#f5f5f5] hover:text-orange'>
                    Tài khoản của tôi
                  </Link>
                  <Link to='/' className='block px-3 py-2 hover:bg-[#f5f5f5] hover:text-orange'>
                    Đơn mua
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='block cursor-pointer px-3 py-2 text-start hover:bg-[#f5f5f5] hover:text-orange'
                  >
                    Đăng xuất
                  </button>
                </div>
              }
            >
              <div className='mr-2 h-5 w-5 flex-shrink-0'>
                <img
                  src='https://down-vn.img.susercontent.com/file/7e3732f16db0a333e33f18b6338e0ab4_tn'
                  alt='avatar'
                  className='h-full w-full rounded-full object-cover'
                />
              </div>
              <div>{profile?.email}</div>
            </Popover>
          )}
        </div>
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
                  {purchasesInCart ? (
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
                          onClick={() => navigate({ pathname: path.cart })}
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
                <span className='absolute -right-1 -top-1 rounded-full bg-white px-1 py-0 text-xs text-orange'>
                  {purchasesInCart?.length}
                </span>
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
