import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Popover from '../Popover'
import { purchasesStatus } from 'src/constants/purchasesStatus'

export default function NavHeader() {
  const queryClient = useQueryClient()
  const { setAuthenticatied, isAuthenticated, profile } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setAuthenticatied(false)
      // Clear data giỏ hàng khi đăng xuất
      queryClient.invalidateQueries(['purchases', { status: purchasesStatus.incart }])
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
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
  )
}
