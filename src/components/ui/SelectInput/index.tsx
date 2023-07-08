import React from "react"
import styled from "@emotion/styled"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import tw from "twin.macro"

import { tagsOptions } from "@/utils/data"

const animatedComponents = makeAnimated()

const SelectInput = ({ ...rest }) => {
  return (
    <SelectStyled
      {...rest}
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      isClearable={true}
      options={tagsOptions}
      placeholder="Sect Post tags"
      classNamePrefix="react-select"
      getOptionLabel={({ name }: any) => `# ${name}`}
      getOptionValue={(option: any) => `${option["name"]}`}
    />
  )
}

const SelectStyled = styled(Select)`
  ${tw`!bg-transparent text-gray-400`}

  & .react-select__control {
    ${tw`!bg-transparent border-none`}
    &:hover {
      ${tw`border-transparent border-none shadow-none`}
    }
  }
  & span & svg {
    ${tw`hidden border-none`}
  }

  & .react-select__indicators {
    ${tw`hidden`}
  }

  & .react-select__menu {
    ${tw`border shadow-lg  border-primary border-opacity-50 bg-base-300 z-50 capitalize max-w-[300px]`}
    & .react-select__option {
      &:first-of-type {
        ${tw`bg-transparent`}
      }
      &:hover {
        ${tw`text-white bg-primary`}
      }
    }
  }

  /* Multi value select box */
  & .react-select__value-container {
    ${tw`gap-2`}
    & div {
      ${tw`mr-1 text-white rounded-lg bg-primary`}
      & .react-select__multi-value__label {
        ${tw`capitalize `}
      }
    }
    & .react-select__input-container {
      ${tw`bg-transparent`}
    }
    & .react-select__placeholder {
      ${tw`text-gray-400 bg-transparent`}
    }
  }
`

export default SelectInput
