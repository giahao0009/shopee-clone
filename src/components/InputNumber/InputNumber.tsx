import { forwardRef, InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500',
    classNameError = 'mt-1 min-h-[1.5rem] text-sm text-red-600',
    onChange,
    ...rest
  },
  ref
) {
  // Check handleChange cho input number
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    // Nếu value lấy ra là số thì mới change nhé
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} ref={ref} onChange={(e) => handleChange(e)} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
