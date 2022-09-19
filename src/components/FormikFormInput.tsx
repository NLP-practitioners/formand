import { Box, Stack, StackProps } from '@mui/material'
import type { FormConstants, FormInputs, RegularFormInput } from '../types'
import { transformString } from '../utils'
import CheckboxInput from './CheckboxInput'
import DatePickerInput from './DatePickerInput'
import PasswordInput from './PasswordInput'
import RangeInput from './RangeInput'
import RatingInput from './RatingInput'
import SelectInput from './SelectInput'
import TagsInput from './TagsInput'
import TextInput from './TextInput'

type FormikFormInputProps<RequestPayload extends Record<string, any>> =
  RegularFormInput<RequestPayload> & {
    autoFocus: boolean
    required: boolean
    placeholder?: string
    label?: keyof RequestPayload | (string & Record<string, never>)
    disabled: boolean
    helperText?: string
    maxLength?: number
  }

export function FormikFormInput<RequestPayload extends Record<string, any>> (
  props: FormikFormInputProps<RequestPayload>
): JSX.Element | null {
  const {
    disabled,
    placeholder,
    helperText,
    required,
    label,
    autoFocus,
    type,
    name,
    maxLength
  } = props

  const transformedLabel = (label
    ?? transformString(name as string, 'pascal')) as string
  const fieldCommonProps = {
    label: transformedLabel,
    disabled,
    placeholder,
    name: name as string,
    required,
    helperText
  }

  switch (type) {
    case 'password': {
      return <PasswordInput autoFocus={autoFocus} {...fieldCommonProps} />
    }
    case 'text': {
      return <TextInput autoFocus={autoFocus} {...fieldCommonProps} />
    }
    case 'text-multi': {
      const { rows = 5 } = props;
      return (
        <TextInput
          multiline
          rows={rows}
          autoFocus={autoFocus}
          maxLength={maxLength}
          {...fieldCommonProps}
        />
      )
    }
    case 'select': {
      const { values, transformation, multiple = false } = props;
      return (
        <SelectInput
          {...fieldCommonProps}
          values={values}
          transformation={transformation}
          multiple={multiple}
        />
      )
    }
    case 'checkbox': {
      const { checked, onClick } = props;

      return (
        <CheckboxInput
          {...fieldCommonProps}
          checked={checked}
          onClick={onClick}
        />
      )
    }

    case 'rating': {
      return <RatingInput {...fieldCommonProps} />
    }

    case 'number': {
      return <TextInput {...fieldCommonProps} type="number" />
    }
    case 'tags': {
      return <TagsInput {...fieldCommonProps} />
    }
    case 'date': {
      return <DatePickerInput {...fieldCommonProps} />
    }
    case 'range': {
      return <RangeInput {...fieldCommonProps} />
    }
    default: {
      return null
    }
  }
}

export type FormikFormInputsProps<RequestPayload extends Record<any, any>> = {
  isDisabled?: boolean
  formInputs: FormInputs<RequestPayload>
} & Pick<
FormConstants<RequestPayload>,
'helperText' | 'label' | 'placeholder' | 'optionalFields'
> &
Partial<StackProps>

export function FormikFormInputs<RequestPayload extends Record<any, any>> ({
  formInputs,
  helperText,
  label,
  optionalFields = [],
  placeholder,
  isDisabled = false,
  ...stackProps
}: FormikFormInputsProps<RequestPayload>): JSX.Element {
  return (
    <Stack {...stackProps}>
      {formInputs.map((formInput, formInputIndex) => (formInput.type === 'group'
        ? (
          <Stack flexDirection="row" gap={1} key={formInput.name}>
            {formInput.items.map((formInputItem, itemIndex) => (
              <Box
                width={`${
                  formInput.sizes
                    ? formInput.sizes[itemIndex] * 100
                    : 100 / formInput.items.length
                }%`}
                key={formInputItem.name as string}
              >
                <FormikFormInput<RequestPayload>
                  autoFocus={itemIndex === 0 && formInputIndex === 0}
                  placeholder={placeholder?.[formInputItem.name]}
                  required={!optionalFields.includes(formInputItem.name)}
                  helperText={helperText?.[formInputItem.name]}
                  label={label?.[formInputItem.name]}
                  disabled={isDisabled}
                  {...formInputItem}
                />
              </Box>
            ))}
          </Stack>
        )
        : (
          <FormikFormInput<RequestPayload>
            autoFocus={formInputIndex === 0}
            key={formInput.name as string}
            placeholder={placeholder?.[formInput.name]}
            required={!optionalFields.includes(formInput.name)}
            label={label?.[formInput.name]}
            disabled={isDisabled}
            helperText={helperText?.[formInput.name]}
            {...formInput}
          />
        )))}
    </Stack>
  )
}
