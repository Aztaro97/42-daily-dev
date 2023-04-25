import React from "react"
import styled from "@emotion/styled"
import { Button } from "react-daisyui"
import tw from "twin.macro"

type TbgColor = {
  bgColor?: "primary" | "secondary" | "transparent" | undefined
}

interface props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  bgColor?: TbgColor["bgColor"];
}

const CustomButton = ({
  children,
  onClick,
  className,
  type,
  bgColor,
  ...rest
}: props) => {
  return (
    <ButtonStyled
      {...rest}
      type={type}
      onClick={onClick}
      className={className}
      bgColor={bgColor}
    >
      {children}
    </ButtonStyled>
  )
}

const ButtonStyled = styled(Button)(
  ({ bgColor }: { bgColor: TbgColor["bgColor"] }) => [
    tw`min-h-[40px] h-auto text-white py-0 text-sm font-normal transition-all duration-300 ease-in-out`,
    bgColor === "primary" && tw`bg-primary`,
    bgColor === "secondary" && tw`bg-secondary`,
    bgColor === "transparent" && tw`bg-transparent`,
    bgColor === undefined && tw`hover:bg-primary`,
  ],
)

export default CustomButton
