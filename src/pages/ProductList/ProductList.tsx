import { Query, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { omitBy, isUndefined } from 'lodash'
import productApi from 'src/apis/product.api'
import Paginate from 'src/components/Paginate'
import useQueryParam from 'src/hooks/useQueryParam'
import { ProductListConfig } from 'src/types/product.type'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams: QueryConfig = useQueryParam()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter
    },
    isUndefined
  )
  const { data } = useQuery({
    queryKey: ['product', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })
  return (
    <div className='bg-gray-200 py-6 '>
      <div className='container'>
        {data && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-2'>
              <AsideFilter />
            </div>
            <div className='col-span-10'>
              <SortProductList />
              <div className=' mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {data.data.data.products.map((product, index) => {
                  return (
                    <div className='col-span-1' key={index}>
                      <Product product={product} />
                    </div>
                  )
                })}
              </div>
              <Paginate queryConfig={queryConfig} pageSize={data.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/*
  Ví dụ về thuật toán phân trang cho sản phẩm
  Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quang current_page
  [1] 2 3 ... 19 20
  1 [2] 3 4 ... 19 20
  1 2 3 4 [5] 6 7 ... 19 20
  1 2 ... 4 5 [6] 7 8 ... 19 20
*/
