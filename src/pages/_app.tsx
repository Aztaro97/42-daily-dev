import { type AppType } from "next/app";
import { api } from "@/utils/api";
import { Roboto } from "@next/font/google";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import GlobalStyles from "@/styles/globalStyles";

import "@/styles/globals.css";

const robotoFont = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
  });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
		<main className={robotoFont.className}>
			<GlobalStyles />
			<Component {...pageProps} />
		</main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);