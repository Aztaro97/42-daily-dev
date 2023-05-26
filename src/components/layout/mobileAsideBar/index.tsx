import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import tw from "twin.macro"

import NavMenu from "@/components/navMenu"
import SwitchTheme from "@/components/switchTheme"

const MobileAsideBar = ({ isOpen }: { isOpen: boolean }) => {
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
          <NavMenu />
          <SwitchTheme />
        </Box>
      )}
    </AnimatePresence>
  )
}

const Box = tw(
  motion.div,
)`absolute top-0 right-0 w-full h-full z-40 p-20 bg-zinc-900`

export default MobileAsideBar
