import React, { FC, useEffect, useRef, useState } from "react"
import { Input } from "react-daisyui"
import tw from "twin.macro"

interface props {
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
}

const SearchInput: FC<props> = ({ setQuery, query }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])
  return (
    <Container>
      <Label>Search Post by name or tags</Label>
      <Input
        ref={inputRef}
        bordered
        type="text"
        placeholder="Search"
        color="primary"
        onChange={(e) => setQuery(e.target.value)}
      />
    </Container>
  )
}

const Container = tw.div`flex flex-col`
const Label = tw.label`text-xl mb-4`

export default SearchInput
