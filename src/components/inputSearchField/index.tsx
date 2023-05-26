import React from "react"
import { Form, Input } from "react-daisyui"

const InputSearchField = () => {
  return (
    <Form>
      <Input width={200} bordered className="!h-[40px] w-28 lg:w-40" type="text" placeholder="Search" />
    </Form>
  )
}

export default InputSearchField
