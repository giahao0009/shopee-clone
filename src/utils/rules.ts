import type { RegisterOptions, UseFormGetValues } from "react-hook-form"
import * as yup from 'yup' // Import yup để tạo schema validation

type Rules = {
  [key in 'email' | 'password' | 'confirmPassword']?: RegisterOptions
}

export const getRules = (getValues?: UseFormGetValues<any>): Rules => {
  return {
    email: {
      required: {
        value: true,
        message: 'Email là bắt buộc'
      },
      pattern: {
        value: /^\S+@\S+\.\S+$/,
        message: 'Email không đúng định dạng'
      },
      maxLength: {
        value: 160,
        message: 'Độ dài từ 5 - 160 ký tự'
      },
      minLength: {
        value: 5,
        message: 'Độ dài từ 5 - 160 ký tự'
      }
    },
    password: {
      required: {
        value: true,
        message: 'Password là bắt buộc'
      },
      maxLength: {
        value: 160,
        message: 'Độ dài từ 5 - 160 ký tự'
      },
      minLength: {
        value: 5,
        message: 'Độ dài từ 5 - 160 ký tự'
      }
    },
    confirmPassword: {
      required: {
        value: true,
        message: 'Nhập lại password là bắt buộc'
      },
      maxLength: {
        value: 160,
        message: 'Độ dài từ 5 - 160 ký tự'
      },
      minLength: {
        value: 5,
        message: 'Độ dài từ 5 - 160 ký tự'
      },
      validate:
        typeof getValues === 'function'
          ? (value) => value === getValues('password') || 'Nhập lại confirm password'
          : undefined
    }
  }
}

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent;
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Confirm Password là bắt buộc')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự')
    .oneOf([yup.ref('password')], 'Confirm password không đúng'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required()
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: schema.fields['confirm_password']
})

export const loginSchema = schema.omit(['confirm_password'])

export type Schema = yup.InferType<typeof schema>
export type UserSchema = yup.InferType<typeof userSchema>
export type LoginSchema = yup.InferType<typeof loginSchema>
