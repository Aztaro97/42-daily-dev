import React from "react";
import { toast } from 'react-toastify';


interface messageProps {
	position?: "TOP_CENTER" | "TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_CENTER" | "BOTTOM_RIGHT";
	message: string;
}

export const successAlert = (message: string) => toast.success(message, {
	// position: `${toast.POSITION[position]}`,
	pauseOnHover: true,
})


export const errorAlert = (message: string) => toast.error(message, {
	// position: `${toast.POSITION[position]}`,
	pauseOnHover: true,
});