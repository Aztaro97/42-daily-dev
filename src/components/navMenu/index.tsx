import React from "react"
import Link from "next/link"
import { Drawer, Menu } from "react-daisyui"
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi"
import { IoBookOutline } from "react-icons/io5"
import { MdOutlinePodcasts, MdOutlinePrivacyTip } from "react-icons/md"
import { SlEarphonesAlt } from "react-icons/sl"
import { TfiWrite } from "react-icons/tfi"
import tw from "twin.macro"

const NavMenu = () => {
  return (
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
  )
}

const MenuTitle = tw(Menu.Title)`font-light mt-10`
const MenuItem = tw(Menu.Item)`hover-bordered bordered`

export default NavMenu
