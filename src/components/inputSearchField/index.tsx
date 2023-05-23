import React from "react"
import { Form, Input } from "react-daisyui"

const InputSearchField = () => {
  return (
    <Form>
      <Input width={200} bordered tw="h-[40px] w-11 lg:w-24" type="text" placeholder="Search" />
    </Form>
  )
}

export default InputSearchField
