import React from "react";
import NavUserAvatar from "@/components/userAvatar";
import tw from "twin.macro";
import useStore from "@/stores/useStore";

import { Navbar, Dropdown, Button, Form, Input } from "react-daisyui";
import CustomButton from "@/components/ui/button";
import SwitchTheme from "@/components/switchTheme";
import Link from "next/link";

const AppHeader = () => {
  const { showModal, setShowModal } = useStore();

  return (
    <HeaderContainer>
      <Navbar>
        <div className="flex-1">
          <Link href="/" className="text-xl normal-case" color="ghost">
            <h1>Logo</h1>
          </Link>
        </div>
        <RightNav>
          <Form>
            <Input bordered type="text" placeholder="Search" />
          </Form>
          <SwitchTheme />
          <Link href="/post/create"><CustomButton>Create Post</CustomButton></Link>
          <Button tw="py-1" onClick={setShowModal}>Login</Button>
          <NavUserAvatar />
        </RightNav>
      </Navbar>
    </HeaderContainer>
  );
};

const HeaderContainer = tw.header`fixed w-full top-0 flex justify-between items-center h-[65px] px-20 gap-10 border-b border-gray-400 border-opacity-40 z-30`;
const RightNav = tw.div`flex-none items-center gap-2`;

export default AppHeader;
