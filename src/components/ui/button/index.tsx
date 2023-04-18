import React from 'react';
import {Button} from "react-daisyui";
import tw from "twin.macro";

interface props {
	children: React.ReactNode;
	onClick: () => void;
	className: string;
	type?: "button" | "submit" | "reset" | undefined;
}

const CustomButton = ({children, onClick, className, type, ...rest}: props) => {
  return (
	<ButtonStyled {...rest} type={type} onClick={onClick} className={className}>{children}</ButtonStyled>
  )
}

const ButtonStyled = tw(Button)`bg-primary text-white py-0 text-sm transition-all duration-300 ease-in-out` 

export default CustomButton