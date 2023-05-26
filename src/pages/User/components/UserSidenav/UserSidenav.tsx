import classNames from 'classnames'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import path from 'src/constants/path'

export default function UserSidenav() {
  const location = useLocation()
  console.log(location)
  return (
    <div>
      <div className='border-b-gray border-b-200 flex items-center py-4'>
        <Link to={path.profile.link} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-black/10'>
          <img
            src='https://down-vn.img.susercontent.com/file/7e3732f16db0a333e33f18b6338e0ab4_tn'
            alt='123'
            className='h-full w-full object-cover'
          />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>Nguyễn Gia Hào</div>
          <Link to={path.profile.link} className='flex items-center capitalize text-gray-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-3 w-3'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
              />
            </svg>
            <span className='ml-1'>Sửa hồ sơ</span>
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <Link
          to={path.profile.link}
          className={classNames('flex cursor-pointer items-center capitalize transition-colors hover:text-orange', {
            'text-orange': path.profile.link === location.pathname
          })}
        >
          <div className='mr-3'>
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
                d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
              />
            </svg>
          </div>
          <span>Tài khoản của tôi</span>
        </Link>
        <Link
          to={path.historyPurchase.link}
          className={classNames(
            'mt-3 flex cursor-pointer items-center capitalize transition-colors hover:text-orange',
            {
              'text-orange': path.historyPurchase.link === location.pathname
            }
          )}
        >
          <div className='mr-3'>
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
                d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
              />
            </svg>
          </div>
          <span>Đơn mua</span>
        </Link>
        <Link
          to={path.changePassword.link}
          className={classNames(
            'mt-3 flex cursor-pointer items-center capitalize transition-colors hover:text-orange',
            {
              'text-orange': path.changePassword.link === location.pathname
            }
          )}
        >
          <div className='mr-3'>
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
                d='M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
              />
            </svg>
          </div>
          <span>Đổi mật khẩu</span>
        </Link>
      </div>
    </div>
  )
}
