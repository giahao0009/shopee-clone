import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorResponse } from '@remix-run/router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import { setProfileToLS } from 'src/utils/auth'
import { userSchema, UserSchema } from 'src/utils/rules'
import { getUrlAvatar } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])
const MAX_SIZE_IMG = 1048576 //bytes

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File>()
  const previewImg = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const { data, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile()
  })
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const updateAvatarMutation = useMutation(userApi.uploadAvatar)
  const profile = data?.data.data
  const avatar = watch('avatar')

  // Dùng useEffect để data ra màn hình
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await updateAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName,
        __v: 0
      })
      refetch()
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      toast.success(res.data.message)
    } catch (error) {
      console.log(error)
    }
  })

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file?.size >= MAX_SIZE_IMG || !file.type.includes('image'))) {
      toast.error('File ảnh không hợp hệ')
    } else {
      setFile(file)
    }
  }

  const handleUpload = () => {
    inputFileRef.current?.click()
  }

  return (
    <div className='rounded-sm bg-white px-7 pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form onSubmit={onSubmit} className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <div className='mt-6 w-full flex-grow pr-12  md:mt-0'>
          <div className='flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Email</div>
            <div className='w-[80%] pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Tên</div>
            <div className='w-[80%] pl-5'>
              <Input
                type='text'
                classNameInput='w-full px-3 py-2 rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                autoComplete='on'
                register={register}
                name='name'
                placeholder='Nhập tên'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-1 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Số điện thoại</div>
            <div className='w-[80%] pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='w-full px-3 py-2 rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                    autoComplete='on'
                    placeholder='Nhập số điện thoại'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-1 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize'>Địa chỉ</div>
            <div className='w-[80%] pl-5'>
              <Input
                type='text'
                classNameInput='w-full px-3 py-2 rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                autoComplete='on'
                register={register}
                name='address'
                placeholder='Nhập địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} onChange={field.onChange} value={field.value} />
            )}
          />

          <div className='mt-1 flex flex-wrap'>
            <div className='w-[20%] truncate pt-3 text-right capitalize' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='mt-2 flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
              >
                Thay đổi
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24 rounded-full border border-orange'>
              <img
                src={previewImg || getUrlAvatar(avatar)}
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <input
              className='hidden'
              type='file'
              accept='.jpg,.jpeg,.png'
              ref={inputFileRef}
              onChange={(event) => onFileChange(event)}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(event) => ((event.target as any).value = null)}
            />
            <button
              onClick={handleUpload}
              type='button'
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dung lượng file tối đa 1 MB</div>
              <div>Định dạng: .JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
