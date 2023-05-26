const path = {
  home: {
    link: '/',
    title: 'Homepage - Clone shopee' as string
  },
  user: {
    link: '/user',
    title: 'User - Clone shopee' as string
  },
  profile: {
    link: '/user/profile',
    title: 'Profile - Clone shopee' as string
  },
  changePassword: {
    link: '/user/password',
    title: 'Change Password - Clone shopee' as string
  },
  historyPurchase: {
    link: '/user/purchase',
    title: 'History - Clone shopee' as string
  },
  login: {
    link: '/login',
    title: 'Login - Clone shopee' as string
  },
  register: {
    link: '/register',
    title: 'Register - Clone shopee' as string
  },

  productDetail: {
    link: '/product/:nameId',
    title: 'Product Detail - Clone shopee' as string
  },
  cart: {
    link: '/cart',
    title: 'Cart - Clone shopee' as string
  },
  logout: {
    link: '/logout',
    title: 'Logout - Clone shopee' as string
  },
  notFound: {
    link: '*',
    title: 'Page not found' as string
  }
}

export default path