import { forwardRef, InputHTMLAttributes, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500',
    classNameError = 'mt-1 min-h-[1.5rem] text-sm text-red-600',
    onChange,
    value,
    ...rest
  },
  ref
) {
  // Tạo local state để phòng tránh trường hợp không truyền onChange
  // Chỉ hiệu nghiệm ngay lần render đầu tiên
  const [localValue, setLocalValue] = useState<string>(value as string)

  // Check handleChange cho input number
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    // Nếu value lấy ra là số thì mới change nhé
    if (/^\d+$/.test(value) || value === '') {
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event)

      // Cập nhật localValue state
      setLocalValue(value)
    }
  }

  return (
    <div className={className}>
      <input
        value={value || localValue}
        className={classNameInput}
        {...rest}
        ref={ref}
        onChange={(e) => handleChange(e)}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
