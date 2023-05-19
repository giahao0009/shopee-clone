import { Query, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { omitBy, isUndefined } from 'lodash'
import productApi from 'src/apis/product.api'
import Paginate from 'src/components/Paginate'
import useQueryParam from 'src/hooks/useQueryParam'
import { ProductListConfig } from 'src/types/product.type'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product/Product'
import SortProductList from './components/SortProductList'
import categoryApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryConfig: QueryConfig = useQueryConfig()

  const { data: productData } = useQuery({
    queryKey: ['product', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='bg-gray-200 py-6 '>
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-2'>
              <AsideFilter categories={categories?.data.data || []} queryConfig={queryConfig} />
            </div>
            <div className='col-span-10'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className=' mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productData.data.data.products.map((product, index) => {
                  return (
                    <div className='col-span-1' key={index}>
                      <Product product={product} />
                    </div>
                  )
                })}
              </div>
              <Paginate queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
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
