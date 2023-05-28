import React from "react"
import Link from "next/link"
import { Drawer, Menu } from "react-daisyui"
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi"
import { IoBookOutline } from "react-icons/io5"
import { MdOutlinePodcasts, MdOutlinePrivacyTip } from "react-icons/md"
import { SlEarphonesAlt } from "react-icons/sl"
import { TfiWrite } from "react-icons/tfi"
import tw from "twin.macro"

import useStore from "@/stores/useStore"

const NavMenu = () => {
  const { showAsideBar, setShowAsideBar } = useStore()

  const onCloseAsideBar = () => {
    if (!showAsideBar) return
    setShowAsideBar(false)
  }

  return (
    <Menu>
      <MenuTitle>
        <span>Discover</span>
      </MenuTitle>
      <MenuItem>
        <Link href="/" onClick={onCloseAsideBar}>
          <IoBookOutline size={20} /> Blogs
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href="/podcast" onClick={onCloseAsideBar}>
          <MdOutlinePodcasts size={20} /> Podcast
        </Link>
      </MenuItem>

      <MenuTitle>
        <span>Others</span>
      </MenuTitle>
      <MenuItem>
        <Link href="/about" onClick={onCloseAsideBar}>
          <HiOutlineUserGroup size={20} /> About
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href="/contact" onClick={onCloseAsideBar}>
          <SlEarphonesAlt size={20} />
          Contact
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href="/privacy" onClick={onCloseAsideBar}>
          <MdOutlinePrivacyTip size={20} /> Privacy Policy
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href="/terms" onClick={onCloseAsideBar}>
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
