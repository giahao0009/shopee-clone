import React, { useState } from 'react'
import InputNumber, { InputNumberProps } from '../InputNumber'

interface Props extends InputNumberProps {
  max?: number
  onDecrement?: (value: number) => void
  onIncrement?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  classNameWrapper?: string
}

export default function QuantityController({
  max,
  onDecrement,
  onIncrement,
  onType,
  classNameWrapper = 'ml-10 ',
  value,
  onFocusOut,
  ...rest
}: Props) {
  const [localValue, setLocalValue] = useState<number>(Number(value) || 1)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    onType && onType(_value)
    setLocalValue(_value)
  }

  const icrement = () => {
    let _value = Number(value || 1) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }

    onIncrement && onIncrement(Number(_value))
    setLocalValue(_value)
  }

  const decrement = () => {
    let _value = Number(value || 1) - 1
    if (_value < 1) {
      _value = 1
    }

    onDecrement && onDecrement(Number(_value))
    setLocalValue(_value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }

  return (
    <div className={'flex items-center' + classNameWrapper}>
      <button
        onClick={decrement}
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-6 w-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        className=''
        classNameError='hidden'
        classNameInput='h-8 w-14 border-t border-b border-gray-300 text-center outline-none'
        onChange={(event) => handleChange(event)}
        onBlur={(event) => handleBlur(event)}
        value={Number(value) || localValue}
        {...rest}
      />
      <button
        onClick={icrement}
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-6 w-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
