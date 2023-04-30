import React, { useState } from "react";
import { Drawer, Menu } from "react-daisyui";
import tw from "twin.macro";
import { TfiWrite } from "react-icons/tfi";
import { IoBookOutline } from "react-icons/io5";
import { SlEarphonesAlt } from "react-icons/sl";
import { MdOutlinePodcasts, MdOutlinePrivacyTip } from "react-icons/md";
import Link from "next/link";
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi";

interface props {
  isSidebarExtended: boolean;
  toggleVisible: () => void;
}

export default function AsideBar({ isSidebarExtended, toggleVisible }: props) {
  return (
    <AsideContainer
    // 	className={`bg-gray-800 text-white w-56 flex-shrink-0 h-full overflow-y-auto ${
    // 	isSidebarExtended ? "w-64" : "w-16"
    //   } sm:w-16 md:w-56 lg:w-64 xl:w-64 2xl:w-64`}
    >
      <div className="z-60 absolute right-0 top-0 py-2">
        <button
          className="mx-auto rounded-full bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
          onClick={toggleVisible}
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M15 12a3 3 0 11-3-3 3 3 0 013 3zM12 18a3 3 0 100-6 3 3 0 000 6zM12 4a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9z"
            />
          </svg>
        </button>
      </div>
      <Menu>
        <MenuTitle>
          <span>Discover</span>
        </MenuTitle>
        <MenuItem>
          <Link href="/">
            <IoBookOutline size={20} /> Blogs
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/podcast">
            <MdOutlinePodcasts size={20} /> Podcast
          </Link>
        </MenuItem>

        <MenuTitle>
          <span>Others</span>
        </MenuTitle>
        <MenuItem>
          <Link href="/about">
            <HiOutlineUserGroup size={20} /> About
          </Link>
        </MenuItem> 
        <MenuItem>
          <Link href="/contact">
            <SlEarphonesAlt size={20} />
            Contact
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/privacy">
            <MdOutlinePrivacyTip size={20} /> Privacy Policy
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/terms">
            <TfiWrite size={20} />
            Terms of Use
          </Link>
        </MenuItem>
      </Menu>
    </AsideContainer>
  );
}

const MenuTitle = tw(Menu.Title)`font-light mt-10`
const MenuItem = tw(Menu.Item)`hover-bordered bordered`

const AsideContainer = tw.aside`border-r border-gray-400 border-opacity-40 px-3 py-5`;
