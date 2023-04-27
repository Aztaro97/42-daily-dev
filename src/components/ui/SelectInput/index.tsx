import React from "react"
import styled from "@emotion/styled"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import tw from "twin.macro"

import { tagsOptions } from "@/utils/data"

const animatedComponents = makeAnimated()

const SelectInput = ({ ...rest }) => {

	const formatGroupLabel = (data) =>  {
		return (<div>
			<span>#</span>
			<span>{data.label}</span>
		  </div>)
	}


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
	  getOptionLabel={({name}: {name:string}) => `# ${name}`}
	  getOptionValue={(option) => `${option['name']}`}
    />
  )
}

const SelectStyled = styled(Select)`
  ${tw`!bg-transparent z-50 text-gray-400`}

  & .react-select__control {
    ${tw`!bg-transparent border-none`}
    &:hover {
      ${tw`border-none border-transparent shadow-none`}
    }
  }
  & span & svg {
    ${tw`border-none hidden`}
  }

  & .react-select__indicators {
    ${tw`hidden`}
  }

  & .react-select__menu {
    ${tw`border shadow shadow-lg border border-primary border-opacity-50 bg-base-300 z-50 capitalize max-w-[300px]`}
    & .react-select__option {
      &:first-of-type {
        ${tw`bg-transparent`}
      }
      &:hover {
        ${tw`bg-primary text-white`}
      }
    }
  }

  /* Multi value select box */
  & .react-select__value-container {
    & div {
      ${tw`bg-primary text-white rounded-lg mr-1`}
      & .react-select__multi-value__label {
        ${tw` capitalize`}
      }
    }
    & .react-select__input-container {
      ${tw`bg-transparent`}
    }
    & .react-select__placeholder {
      ${tw`bg-transparent text-gray-400`}
    }
  }
`

export default SelectInput
