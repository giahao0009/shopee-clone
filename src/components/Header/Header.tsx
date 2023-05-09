import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import Logo from '../Logo'
import Popover from '../Popover'

export default function Header() {
  const { setAuthenticatied, isAuthenticated, profile } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setAuthenticatied(false)
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

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
          <form className='col-span-9 w-full'>
            <div className='flex rounded-sm bg-white p-1'>
              <input
                type='text'
                name='search'
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
                  className='h-6 w-6'
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
                  <div className='p-2'>
                    <div className='capitalize text-stone-500'>Sản phẩm mới thêm</div>
                    <div className='mt-5'>
                      <div className='mt-4 flex'>
                        <div className='flex-shrink-0'>
                          <img
                            src='https://down-vn.img.susercontent.com/file/e62c605c5bb779dce164eb557ded60bb_tn'
                            alt='hinh anh'
                            className='h-10 w-10 object-cover'
                          />
                        </div>
                        <div className='ml-2 flex-grow overflow-hidden'>
                          <div className='truncate'>
                            Thắt lưng/ dây lưng dây NỊT THUN móc quần tụt bóp eo co giãn điều chỉnh kích cỡ cúc bấm 2
                            bên vải thun 221DL008i
                          </div>
                        </div>
                        <div className='ml-2 flex-shrink-0'>
                          <div className='text-orange'>₫39.900</div>
                        </div>
                      </div>
                      <div className='mt-4 flex'>
                        <div className='flex-shrink-0'>
                          <img
                            src='https://down-vn.img.susercontent.com/file/e62c605c5bb779dce164eb557ded60bb_tn'
                            alt='hinh anh'
                            className='h-10 w-10 object-cover'
                          />
                        </div>
                        <div className='ml-2 flex-grow overflow-hidden'>
                          <div className='truncate'>
                            Thắt lưng/ dây lưng dây NỊT THUN móc quần tụt bóp eo co giãn điều chỉnh kích cỡ cúc bấm 2
                            bên vải thun 221DL008i
                          </div>
                        </div>
                        <div className='ml-2 flex-shrink-0'>
                          <div className='text-orange'>₫39.900</div>
                        </div>
                      </div>
                      <div className='mt-4 flex'>
                        <div className='flex-shrink-0'>
                          <img
                            src='https://down-vn.img.susercontent.com/file/e62c605c5bb779dce164eb557ded60bb_tn'
                            alt='hinh anh'
                            className='h-10 w-10 object-cover'
                          />
                        </div>
                        <div className='ml-2 flex-grow overflow-hidden'>
                          <div className='truncate'>
                            Thắt lưng/ dây lưng dây NỊT THUN móc quần tụt bóp eo co giãn điều chỉnh kích cỡ cúc bấm 2
                            bên vải thun 221DL008i
                          </div>
                        </div>
                        <div className='ml-2 flex-shrink-0'>
                          <div className='text-orange'>₫39.900</div>
                        </div>
                      </div>
                      <div className='mt-4 flex'>
                        <div className='flex-shrink-0'>
                          <img
                            src='https://down-vn.img.susercontent.com/file/e62c605c5bb779dce164eb557ded60bb_tn'
                            alt='hinh anh'
                            className='h-10 w-10 object-cover'
                          />
                        </div>
                        <div className='ml-2 flex-grow overflow-hidden'>
                          <div className='truncate'>
                            Thắt lưng/ dây lưng dây NỊT THUN móc quần tụt bóp eo co giãn điều chỉnh kích cỡ cúc bấm 2
                            bên vải thun 221DL008i
                          </div>
                        </div>
                        <div className='ml-2 flex-shrink-0'>
                          <div className='text-orange'>₫39.900</div>
                        </div>
                      </div>
                      <div className='mt-4 flex'>
                        <div className='flex-shrink-0'>
                          <img
                            src='https://down-vn.img.susercontent.com/file/e62c605c5bb779dce164eb557ded60bb_tn'
                            alt='hinh anh'
                            className='h-10 w-10 object-cover'
                          />
                        </div>
                        <div className='ml-2 flex-grow overflow-hidden'>
                          <div className='truncate'>
                            Thắt lưng/ dây lưng dây NỊT THUN móc quần tụt bóp eo co giãn điều chỉnh kích cỡ cúc bấm 2
                            bên vải thun 221DL008i
                          </div>
                        </div>
                        <div className='ml-2 flex-shrink-0'>
                          <div className='text-orange'>₫39.900</div>
                        </div>
                      </div>
                    </div>
                    <div className='mt-6 flex items-center justify-between'>
                      <div className='text-xs capitalize text-stone-500'>10 Thêm hàng vào giỏ </div>
                      <button className='cursor-pointer rounded-sm bg-orange px-3 py-2 capitalize text-white hover:bg-opacity-90'>
                        Xem giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>
              }
            >
              <Link to='/'>
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
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
