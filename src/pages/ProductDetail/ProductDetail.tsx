import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import { formatCurrency, getIdFromNameId, rateSale } from 'src/utils/utils'
import DOMPurify from 'dompurify'
import Product from '../ProductList/components/Product'
import QuantityController from 'src/components/QuantityController'
import purchaseApi from 'src/apis/purchase.api'
import { Axios, AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constants/httpStatusCode.enum'
import path from 'src/constants/path'
import { toast } from 'react-toastify'
import { purchasesStatus } from 'src/constants/purchasesStatus'
import useDocumentTitle from 'src/hooks/useDocumentTitle'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [buyCount, setBuyCount] = useState<number>(1)
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const imageRef = useRef<HTMLImageElement>(null)
  const product = data?.data?.data
  const currentImages = useMemo(
    () => (product ? product?.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )
  const queryConfig: ProductListConfig = { limit: 5, page: 1, category: product?.category._id }
  const { data: productsSame } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig),
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.addToCart(body),
    onSuccess: (data) => {
      // Ta dùng Invalidation Query của react-query để thực hiện việc truy vấn lại một querykey
      // Khi đó sẽ tự động truy vấn lại API để cập nhật lại dữ liệu ra màn hình
      queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.incart }] })
      toast.success(data.data.message, { autoClose: 3000 })
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === HttpStatusCode.Unauthorized) {
        navigate({
          pathname: path.login.link
        })
      }
    }
  })

  useDocumentTitle('Product detail')

  useEffect(() => {
    if (product && product?.images.length > 0) {
      setActiveImage(product?.images[0])
    }
  }, [product])

  const chooseImage = (img: string) => {
    setActiveImage(img)
  }

  const nextImage = () => {
    if (currentIndexImages[1] < (product as ProductType)?.images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prevImage = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Dùng để lấy chiều cao, chiều rộng của thẻ div nhận sự kiện onMouseMove
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalWidth, naturalHeight } = image

    // Cách 1: lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý bubble event
    const { offsetX, offsetY } = event.nativeEvent
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'

    // Event bubble, sự kiện event bị chồng chéo, mình đang hover cha, nhưng nó cũng đang hover vào con\
    // Cách khắc phục, dùng class pointer-events-none là được, vào thẻ img nhá
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate({ buy_count: buyCount, product_id: product?._id as string })
  }

  const handleBuyNow = async () => {
    try {
      const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
      const purchase = res.data.data
      navigate(path.cart.link, { state: { purchaseId: purchase._id } })
    } catch (error) {
      console.log(error)
      toast.error('Không thể thực hiện việc mua sản phẩm')
    }
  }

  if (!product) {
    return null
  }

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseLeave={handleRemoveZoom}
                onMouseMove={handleZoom}
              >
                <img
                  src={activeImage}
                  alt={product?.name}
                  className='pointer-events-none absolute left-0 top-0 h-full w-full bg-white object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-[50%] bg-black/20 text-white'
                  onClick={prevImage}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img, index) => {
                  const isActive = img === activeImage
                  return (
                    <div
                      className='relative w-full cursor-pointer pt-[100%]'
                      key={img}
                      onMouseEnter={() => chooseImage(img)}
                    >
                      <img
                        src={img}
                        alt={product?.name}
                        className='absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className='absolute left-0 top-0 h-full w-full border-2 border-orange'></div>}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-[50%] bg-black/20 text-white'
                  onClick={nextImage}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='mr-1 text-xl font-medium uppercase'>{product?.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-orange text-orange'>{product?.rating}</span>
                  <ProductRating
                    rating={product?.rating as number}
                    activeClassname='fill-orange text-orange h-3 w-3 '
                    noneActiveClassname='h-3 w-3 fill-gray-300 text-gray-300'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{product?.sold}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>{formatCurrency(product?.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>{formatCurrency(product?.price)}</div>
                <div className='ml-4 flex rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <QuantityController
                  onIncrement={handleBuyCount}
                  onDecrement={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product?.quantity}
                />
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>

                  <span>Thêm vào giỏ hàng</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-2 capitalize text-white shadow-sm hover:opacity-80'
                >
                  Mua Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
          <div className='mx-4 mt-12 text-sm leading-loose'>
            {/* Những đoạn code trong này là code có khả năng nguy hiểm */}
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description) }}></div>
          </div>
        </div>
        <div className='mt-8'>
          <div className='uppercase text-gray-600'>Sản phẩm cùng loại</div>
          {productsSame && (
            <div className=' mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {productsSame.data.data.products.map((product, index) => {
                return (
                  <div className='col-span-1' key={index}>
                    <Product product={product} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
