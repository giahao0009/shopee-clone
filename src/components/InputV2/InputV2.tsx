import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  classNameError?: string
}

function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: UseControllerProps<TFieldValues, TName> & InputNumberProps) {
  const {
    type,
    onChange,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500',
    classNameError = 'mt-1 min-h-[1.5rem] text-sm text-red-600',
    value = '',
    ...rest
  } = props

  const { field, fieldState } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)

  // Check handleChange cho input number
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFormInput = event.target.value
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFormInput) || valueFormInput === '')
    // Nếu value lấy ra là số thì mới change nhé
    if (numberCondition || type !== 'number') {
      // Cập nhật localValue state
      setLocalValue(valueFormInput)
      // Gọi field.onChange để cập nhật vào state react hook form
      field.onChange(event)
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event)
    }
  }

  return (
    <div className={className}>
      <input
        {...rest}
        {...field} //nên để rest và field lên đầu để nó overide lại
        value={value || localValue}
        className={classNameInput}
        onChange={(e) => handleChange(e)}
      />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2

// type Gen<TFunc> = {
//   getName: TFunc
// }

// Cách handle generic typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function Hexa<TFunc extends () => string, TLastName extends ReturnType<TFunc>>(props: {
//   person: Gen<TFunc>
//   lastName: TLastName
// }) {
//   return null
// }

// const handleReturn: () => 'Duoc' = () => 'Duoc'

// function App() {
//   return <Hexa person={{ getName: handleReturn }} lastName='Duoc' />
// }
