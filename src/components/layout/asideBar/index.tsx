import React, { useState } from "react";
import { Drawer, Menu } from "react-daisyui";
import tw from "twin.macro";

export default function AsideBar({ isSidebarExtended, toggleVisible }) {
  return (
    <AsideContainer
    // 	className={`bg-gray-800 text-white w-56 flex-shrink-0 h-full overflow-y-auto ${
    // 	isSidebarExtended ? "w-64" : "w-16"
    //   } sm:w-16 md:w-56 lg:w-64 xl:w-64 2xl:w-64`}
    >
		<div className="absolute top-0 -right-10 right-0 py-2 z-60">
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
      <Menu >
		<Menu.Title>
          <span>Discover</span>
        </Menu.Title>
        <Menu.Item className="hover-bordered bordered">
          <a >Popular</a>
        </Menu.Item>
        <Menu.Item  className="hover-bordered bordered">
          <a>Most Like</a>
        </Menu.Item>

		<Menu.Title>
          <span>Manage</span>
        </Menu.Title>
        <Menu.Item  className="hover-bordered bordered">
          <a>BookMark</a>
        </Menu.Item>
        <Menu.Item  className="hover-bordered bordered">
          <a>Reading History</a>
        </Menu.Item>

        
      </Menu>
    </AsideContainer>
  );
}

const AsideContainer = tw.aside`border-r border-gray-400 border-opacity-40 px-3 py-5`;
