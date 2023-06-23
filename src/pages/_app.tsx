import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { log } from "next-axiom"

import { api } from "@/utils/api"
import GlobalStyles from "@/styles/globalStyles"
import "@/styles/globals.css"
import "react-toastify/dist/ReactToastify.css"
import "react-loading-skeleton/dist/skeleton.css"
import AppWrapper from "@/components/appWrapper"

export { reportWebVitals } from "next-axiom"

log.info("Hello from frontend", { foo: "bar" })

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
