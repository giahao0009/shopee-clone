import React from 'react'
import UserSidenav from '../../components/UserSidenav'

interface Props {
  children: React.ReactNode
}

export default function UserLayout({ children }: Props) {
  return (
    <div className='bg-neutral-100 py-16 text-sm text-gray-600'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          <div className='md:col-span-3 lg:col-span-2'>
            <UserSidenav />
          </div>
          <div className='md:col-span-9 lg:col-span-10'>{children}</div>
        </div>
      </div>
    </div>
  )
}
