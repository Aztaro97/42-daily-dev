import React from "react"
import { Roboto } from "next/font/google"
import NextProgress from "next-progress"
import { DefaultSeo } from "next-seo"
import { NEXT_SEO_DEFAULT } from "next-seo.config"
import { SkeletonTheme } from "react-loading-skeleton"
import { ToastContainer } from "react-toastify"

import GlobalStyles from "@/styles/globalStyles"
import { colors } from "@/constants/constants"

const robotoFont = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
})

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DefaultSeo {...NEXT_SEO_DEFAULT} />
      <NextProgress color={colors.PRIMARY} options={{ showSpinner: false }} />
      <main className={robotoFont.className}>
        <GlobalStyles />
        <SkeletonTheme baseColor={"#1e293b"} highlightColor="#334155">
          {children}
        </SkeletonTheme>
        <ToastContainer autoClose={3000} hideProgressBar />
      </main>
    </>
  )
}

export default AppWrapper
