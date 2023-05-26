import { useMutation, useQuery } from '@tanstack/react-query'
import { every, filter, keyBy, map, reduce } from 'lodash'
import React, { Fragment, useContext, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchasesStatus'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { produce } from 'immer'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import nodata from 'src/assets/images/cart_nodata.jpg'
import useDocumentTitle from 'src/hooks/useDocumentTitle'

const MIN_QUANTITY = 1

export default function Cart() {
  const navigate = useNavigate()
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const { data: purchaseData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.incart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.incart })
  })

  const updatePurchasesMutation = useMutation({
    mutationFn: (data: { product_id: string; buy_count: number }) => purchaseApi.updatePurchases(data),
    onSuccess: () => {
      refetch()
    }
  })

  const buyPurchasesMutation = useMutation({
    mutationFn: (data: { product_id: string; buy_count: number }[]) => purchaseApi.buyPurchases(data),
    onSuccess: () => {
      toast.success('Thanh toán thành công')
      refetch()
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: (ids: string[]) => purchaseApi.deletePurchase(ids),
    onSuccess: () => {
      refetch()
    }
  })
  const location = useLocation()
  // Dùng useMemo để tăng perporment
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string | null })?.purchaseId
  const purchasesInCart: Purchase[] | undefined = purchaseData?.data.data
  const isAllChecked: boolean = useMemo(() => every(extendedPurchases, (item) => item.checked), [extendedPurchases])
  const checkedPurchases: Purchase[] = useMemo(
    () => filter(extendedPurchases, (item) => item.checked),
    [extendedPurchases]
  )
  const checkedPurchasesCount: number = checkedPurchases.length
  const totalCheckedAmount: number = useMemo(() => {
    return reduce(
      checkedPurchases,
      (sum, item) => {
        return sum + item.product.price * item.buy_count
      },
      0
    )
  }, [checkedPurchases])
  const totalCheckedAmountSaving: number = useMemo(() => {
    return reduce(
      checkedPurchases,
      (sum, item) => {
        return sum + (item.product.price_before_discount - item.product.price) * item.buy_count
      },
      0
    )
  }, [checkedPurchases])

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        map(purchasesInCart, (item) => {
          const ischoosenPurchaseIdFromLocation = item._id === choosenPurchaseIdFromLocation
          return {
            ...item,
            disabled: false,
            checked: ischoosenPurchaseIdFromLocation || Boolean(extendedPurchasesObject[item._id]?.checked)
          }
        }) || []
      )
    })
  }, [choosenPurchaseIdFromLocation, purchasesInCart, setExtendedPurchases])

  useEffect(() => {
    // Sử dụng cleanup function, cleanup function được gọi khi component bị destroy khỏi DOM
    return () => {
      window.history.replaceState(null, '') // Khi F5 lại trang thì sẽ null cái state của history
    }
  }, [])

  useDocumentTitle('Cart - Clone shopee')

  const handleChecked = (productIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[productIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchases((prev) =>
      map(prev, (item) => ({
        ...item,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (productIndex: number, value: number, enabled: boolean) => {
    if (enabled) {
      const purchase = extendedPurchases[productIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[productIndex].disabled = true
        })
      )
      updatePurchasesMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (productIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[productIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteMany = () => {
    const purchaseIds = map(checkedPurchases, (item) => item._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = map(checkedPurchases, (item) => ({
        product_id: item.product._id,
        buy_count: item.buy_count
      }))
      buyPurchasesMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases && extendedPurchases.length > 0 ? (
          <Fragment>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllChecked}
                          onChange={handleCheckedAll}
                        />
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
                  {map(extendedPurchases, (item, index) => (
                    <div
                      key={item._id}
                      className='mb-3 grid grid-cols-12 rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 shadow'
                    >
                      <div className='col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-orange'
                              checked={item.checked}
                              onChange={handleChecked(index)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link
                                to={`${path.home.link}${generateNameId({ name: item.product.name, id: item.product._id })}`}
                                className='h-20 w-20 flex-shrink-0'
                              >
                                <img alt={item.product.name} src={item.product.image} />
                              </Link>
                              <div className='flex-grow px-2 pb-2 pt-1'>
                                <Link
                                  to={`${path.home.link}${generateNameId({
                                    name: item.product.name,
                                    id: item.product._id
                                  })}`}
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
                              onIncrement={(value: number) => {
                                const enable: boolean = value <= item.product.quantity
                                return handleQuantity(index, value, enable)
                              }}
                              onDecrement={(value: number) => {
                                const enable: boolean = value >= MIN_QUANTITY
                                return handleQuantity(index, value, enable)
                              }}
                              onType={handleTypeQuantity(index)}
                              onFocusOut={(value) => {
                                const enable: boolean =
                                  value >= 1 &&
                                  value <= item.product.quantity &&
                                  value !== (purchasesInCart as Purchase[])[index].buy_count
                                return handleQuantity(index, value, enable)
                              }}
                              disabled={item.disabled}
                            />
                          </div>
                          <div className='col-span-1'>
                            <span className='text-orange'>{formatCurrency(item.price * item.buy_count)}</span>
                          </div>
                          <div className='col-span-1'>
                            <button
                              onClick={handleDelete(index)}
                              className='bg-none text-black transition-colors hover:text-orange'
                            >
                              Xoá
                            </button>
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
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    checked={isAllChecked}
                    onChange={handleCheckedAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none outline-none' onClick={handleCheckedAll}>
                  Chọn tất cả ({extendedPurchases.length})
                </button>
                <button className='mx-3 border-none bg-none outline-none' onClick={handleDeleteMany}>
                  Xoá
                </button>
              </div>

              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                    <div className='text-2xl text-orange sm:ml-2'>{formatCurrency(totalCheckedAmount)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm:</div>
                    <div className='text-orange sm:ml-6'>{formatCurrency(totalCheckedAmountSaving)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPurchases}
                  disabled={buyPurchasesMutation.isLoading}
                  className='mt-2 h-10 w-full rounded bg-orange text-white shadow hover:opacity-90 sm:ml-2 sm:mt-0 sm:w-48'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <div>
              <img src={nodata} alt='no product' className='h-60 w-60' />
            </div>
            <div className='mt-2 text-lg capitalize text-orange'>Giỏ hàng của bạn còn trống</div>
            <Button
              onClick={() => navigate(path.home.link)}
              className='mt-3 rounded-sm bg-orange px-3 py-2 text-white outline-none hover:opacity-90'
            >
              Mua ngay
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
