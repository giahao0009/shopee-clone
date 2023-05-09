import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import _ from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'

type Inputs = Schema

type AccountMutation = Omit<Inputs, 'confirm_password'>

export default function Register() {
  const { setAuthenticatied } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: yupResolver(schema) // Truyền schema vào để validation
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: AccountMutation) => authApi.registerAccount(body),
    onSuccess: () => {
      setAuthenticatied(true)
      navigate('/')
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse<AccountMutation>>(error)) {
        const formError = error.response?.data.data
        // Cách dùng 1
        // Tạo ra 1 vòng lặp trên các key của object formError
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof AccountMutation, {
              // Lấy ra các key của AccountMutation và ép kiểu cho key để không bị lỗi
              message: formError[key as keyof AccountMutation],
              type: 'Server'
            })
          })
        }

        // Cách dùng 2
        // if (formError?.email) {
        //   setError('email', {
        //     message: formError.email,
        //     type: 'Server'
        //   })
        // }
        // if (formError?.password) {
        //   setError('password', {
        //     message: formError.password,
        //     type: 'Server'
        //   })
        // }
      }
    }
  })

  const onSubmit = handleSubmit(
    (valid) => {
      const body: AccountMutation = _.omit(valid, ['confirm_password'])
      registerAccountMutation.mutate(body)
    },
    (invalid) => {
      console.log(invalid)
    }
  )

  // const formValue = watch() // Cái method này sẽ genra sự kiện để rerender lại component
  // const email = watch('email') // Cái method này sẽ lấy ra được cái thuộc tính được truyền vào và chạy mỗi khi input change
  // const formValue = getValues()
  // console.log(formValue)

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-10 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='rounded bg-white p-10 shadow-sm' noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                placeholder='Email'
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
              />
              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm password'
                autoComplete='on'
              />
              <Button
                isLoading={registerAccountMutation.isLoading}
                disabled={registerAccountMutation.isLoading}
                type='submit'
                className='w-full bg-red-500 px-2 py-4 text-center uppercase text-white hover:bg-red-600'
              >
                Đăng ký
              </Button>
              <div className='mt-8 text-center'>
                <div className='flex justify-center'>
                  <span className='text-slate-400'>Bạn đã có tài khoản? </span>
                  <Link to='/login' className='text-red-400'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
