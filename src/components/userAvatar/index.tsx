import React, { useState } from "react";
import { Navbar, Dropdown, Button, Divider } from "react-daisyui";
import tw from "twin.macro";
import { BsBookmark } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { useLocalStorage } from "usehooks-ts";
import Image from "next/image";
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineSetting } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";

export default function NavUserAvatar() {
  const [theme] = useLocalStorage("theme", "night");

  return (
    <Dropdown end={true} vertical="bottom">
      <Button color="ghost" className="avatar" shape="circle">
        <ProfilePicture
          src="https://i.pravatar.cc/300"
          width={140}
          height={140}
          alt="Profile Picture"
        />
      </Button>
      <Dropdown.Menu
        tw="border border-gray-400 border-opacity-50 menu-compact"
        className="w-52"
        dataTheme={theme}
      >
        <Dropdown.Item>
          <HiOutlineUser size={20} />
          Profile
        </Dropdown.Item>
        <Dropdown.Item>
          <IoBookOutline size={20} /> My Post
        </Dropdown.Item>
        <Dropdown.Item>
          <BsBookmark size={20} /> My Bookmarks
        </Dropdown.Item>
        <Dropdown.Item>
          <AiOutlineSetting size={20} /> Settings
        </Dropdown.Item>
        <Divider tw="my-0 py-0" />
        <Dropdown.Item>
          <MdOutlineLogout size={20} />
          Log Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const ProfilePicture = tw(Image)`w-10 h-10 rounded-full`;
