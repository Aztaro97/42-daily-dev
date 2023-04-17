import React, {useState} from "react";
import {Navbar, Dropdown, Button} from "react-daisyui"
import tw from "twin.macro"
import { useLocalStorage } from "usehooks-ts";
import Image from "next/image";


export default function NavUserAvatar() {
	const [theme] = useLocalStorage("theme");


	return (
	  <Dropdown end={true} vertical="bottom" >
		<Button color="ghost" className="avatar" shape="circle">
			<ProfilePicture src="https://i.pravatar.cc/300" width={140} height={140} alt="Profile Picture" />
		</Button>
		<Dropdown.Menu tw="border border-gray-400 border-opacity-50 menu-compact" className="w-52" dataTheme={theme}>
		  <Dropdown.Item>Profile</Dropdown.Item>
		  <Dropdown.Item>Settings</Dropdown.Item>
		  <Dropdown.Item>My Post</Dropdown.Item>
		</Dropdown.Menu>
	  </Dropdown>
  	)
}

const ProfilePicture = tw(Image)`w-10 h-10 rounded-full`