import { InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  classNameInput?: string
  classNameError?: string
}

export default function Input({
  errorMessage,
  className,
  name,
  register,
  rules,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500',
  classNameError = 'mt-1 min-h-[1.5rem] text-sm text-red-600',
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input {...registerResult} className={classNameInput} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
