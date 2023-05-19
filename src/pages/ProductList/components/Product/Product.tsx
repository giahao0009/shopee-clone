import React from 'react'
import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

interface Props {
  product: ProductType
}

// Có một trick cho hình ảnh
// set width: 100% và padding-top: 100% thì ảnh luôn là hình vuông
export default function Product({ product }: Props) {
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='rounded-sm bg-white shadow-lg'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[1.75rem] text-sm line-clamp-2'>{product.name}</div>
        </div>
        <div className='mt-0 flex items-center gap-1 p-2'>
          <div className='max-w-[50%] truncate text-gray-500 line-through'>
            {formatCurrency(product.price_before_discount)}
          </div>
          <div className='max-w-[50%] truncate text-orange'>{formatCurrency(product.price)}</div>
        </div>
        <div className='mt-0 flex items-center justify-start gap-2 px-2 pb-2'>
          <ProductRating rating={product.rating} />
          <div className='text-sm text-gray-400'>
            Đã bán <span>{product.sold}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
