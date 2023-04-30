import { type AppType } from "next/app"
import { Roboto } from "next/font/google"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"

import { api } from "@/utils/api"
import GlobalStyles from "@/styles/globalStyles"
import "@/styles/globals.css"
import "react-toastify/dist/ReactToastify.css"

const robotoFont = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={robotoFont.className}>
        <GlobalStyles />
        <Component {...pageProps} />
        <ToastContainer autoClose={3000} />
      </main>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
