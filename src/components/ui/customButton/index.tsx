import React from "react"
import styled from "@emotion/styled"
import { Button } from "react-daisyui"
import tw from "twin.macro"

type Tvariant = {
  variants?: "primary" | "secondary" | "transparent" | undefined
}

interface props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  variants?: Tvariant["variants"];
  loading?: boolean;
  disabled?: boolean;
}

const CustomButton = ({
  children,
  onClick,
  className,
  type,
  variants,
  loading,
  disabled,
  ...rest
}: props) => {
  return (
    <ButtonStyled
      {...rest}
      type={type}
      onClick={onClick}
      className={className}
      variants={variants}
	  loading={loading}
	  disabled={disabled}
    >
      {children}
    </ButtonStyled>
  )
}

const ButtonStyled = styled(Button)(
  ({ variants }: { variants: Tvariant["variants"] }) => [
    tw`min-h-[40px] h-auto capitalize text-white py-0 text-sm font-normal transition-all duration-300 ease-in-out`,
    variants === "primary" && tw`bg-primary`,
    variants === "secondary" && tw`bg-secondary`,
    variants === "transparent" && tw`bg-transparent`,
    variants === undefined && tw`hover:bg-primary`,
  ],
)

export default CustomButton
