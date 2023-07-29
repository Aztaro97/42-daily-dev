import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "react-daisyui"
import { IoMdClose } from "react-icons/io"
import tw from "twin.macro"

import NavMenu from "@/components/navMenu"
import SwitchTheme from "@/components/switchTheme"
import useStore from "@/stores/useStore"

const MobileAsideBar = ({ isOpen }: { isOpen: boolean }) => {
  const { setShowAsideBar } = useStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <Box
          initial={{ width: 0, translateX: "-1000px" }}
          animate={{
            width: "100%",
            translateX: "0px",
          }}
          exit={{
            width: 0,
            translateX: "-1000px",
            transition: {
              delay: 0.4,
              duration: 0.3,
            },
          }}
          transition={{
            type: "spring",
            bounce: 0.1,
          }}
        >
          <CloseBtn onClick={() => setShowAsideBar(false)}>
            <IoMdClose size={24} />
          </CloseBtn>
          <NavMenu />
          {/* <SwitchThemeStyled /> */}
        </Box>
      )}
    </AnimatePresence>
  )
}

const Box = tw(
  motion.div,
)`fixed top-0 right-0 left-0 bottom-0 w-full !h-full z-40 p-10 bg-zinc-950 overflow-hidden`

const CloseBtn = tw(Button)`w-10 h-10 float-right text-gray-400 p-1`
const SwitchThemeStyled = tw(SwitchTheme)`mt-10 ml-5`

export default MobileAsideBar
