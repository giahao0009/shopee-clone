import React from 'react'
import { createContext, ReactNode, useState } from 'react'
import { ExtendedPurchase } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfile } from 'src/utils/auth'

// Các bước sử dụng context API của react
// Ta dùng context API để tạo global state
// Context API bao gồm các thành phần
// - context: đối tượng context là đối tượng lưu trữ giá trị của context hiện tại
// - provider: là một component của react cung cấp giá trị, nó lấy từ đối tượng context
// - consumer: là một component có thể sử dụng giá trị của provider và có thể hiển thị giá trị.

// Đây là interface của context
interface AppContextInterface {
  isAuthenticated: boolean
  setAuthenticatied: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchase[]
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
  reset: () => void
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setAuthenticatied: () => {
    throw new Error('Function not implemented.')
  },
  profile: getProfile(),
  setProfile: () => {
    throw new Error('Function not implemented.')
  },
  extendedPurchases: [],
  setExtendedPurchases: () => {
    throw new Error('Function not implemented.')
  },
  reset: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Set state chung cho toàn app
  // State để kiểm tra xem người dùng có đăng nhập chưa
  const [isAuthenticated, setAuthenticatied] = useState<boolean>(initialAppContext.isAuthenticated)
  // State để set profile của người dùng khi đã đăng nhập
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  // State để quản lý extendedPurchases
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>(initialAppContext.extendedPurchases)

  // Return về provider cho app
  // AppContext.Provider là một component của react cung cấp khi đã khởi tạo context
  // Ta cần truyền props value để khởi tạo giá trị ban đâu
  // Ta cần truyền children để bọc provider vào app

  // Tạo hàm reset lại data
  const reset = () => {
    setAuthenticatied(false)
    setExtendedPurchases([])
    setProfile(null)
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setAuthenticatied,
        profile: profile,
        setProfile,
        extendedPurchases,
        setExtendedPurchases,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
