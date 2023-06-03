import React from "react"
import { Roboto } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { DefaultSeo } from "next-seo"
import { NEXT_SEO_DEFAULT } from "next-seo.config"
import { ToastContainer } from "react-toastify"

import GlobalStyles from "@/styles/globalStyles"

const robotoFont = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
})

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DefaultSeo {...NEXT_SEO_DEFAULT} />
      <main className={robotoFont.className}>
        <GlobalStyles />
        {children}
        <ToastContainer autoClose={3000} hideProgressBar />
      </main>
    </>
  )
}

export default AppWrapper
