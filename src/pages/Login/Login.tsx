import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from 'src/components/Input'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'

type Inputs = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setAuthenticatied, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<Inputs>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: Inputs) => {
      return authApi.loginAccount(body)
    }
  })

  const onSubmit = handleSubmit(
    (valid: Inputs) => {
      loginMutation.mutate(valid, {
        onSuccess: (data) => {
          setAuthenticatied(true)
          setProfile(data.data.data.user)
          navigate('/')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponse<Inputs>>(error)) {
            const formError = error.response?.data.data
            // Cách dùng 1
            // Tạo ra 1 vòng lặp trên các key của object formError
            if (formError) {
              Object.keys(formError).forEach((key) => {
                setError(key as keyof Inputs, {
                  // Lấy ra các key của AccountMutation và ép kiểu cho key để không bị lỗi
                  message: formError[key as keyof Inputs],
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
    },
    (invalid) => {
      console.log(invalid)
    }
  )

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-10 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng nhập</div>
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
              <Button
                isLoading={loginMutation.isLoading}
                disabled={loginMutation.isLoading}
                type='submit'
                className='w-full bg-red-500 px-2 py-4 text-center uppercase text-white hover:bg-red-600'
              >
                Đăng nhập
              </Button>
              <div className='mt-8 text-center'>
                <div className='flex justify-center'>
                  <span className='text-slate-400'>Bạn chưa có tài khoản? </span>
                  <Link to='/register' className='text-red-400'>
                    Đăng ký
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
