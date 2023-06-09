import React from 'react'
import { useForm } from 'react-hook-form'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { omit } from 'lodash'
import path from 'src/constants/path'
import useQueryConfig from './useQueryConfig'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

export default function useSearchProduct() {
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })

  const onSubmitSearch = handleSubmit(
    (data) => {
      navigate({
        pathname: path.home.link,
        search: createSearchParams(omit({ ...queryConfig, name: data.name }, ['order'])).toString()
      })
    },
    (_) => {
      navigate({
        pathname: path.home.link,
        search: createSearchParams(omit({ ...queryConfig }, ['name'])).toString()
      })
    }
  )
  return { onSubmitSearch, register }
}
