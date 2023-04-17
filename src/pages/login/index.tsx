import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import tw from "twin.macro";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const callbackUrl = decodeURI((router.query?.callbackUrl as string) ?? "/");

  console.log("callbackUrl", callbackUrl);

  const handleLogin = async () => {
    await signIn("42-school", {
      redirect: true,
      callbackUrl,
    });
  };

  //   console.log("session", session)

  //   useEffect(() => {
  //     console.log(session);
  //     if (session) {
  //       router.push(callbackUrl);
  //     }
  //   }, [session]);

  return (
    <Container>
      {/* <button onClick={handleLogin}>Login </button> */}

      {session ? (
        <>
          Sign in as {session?.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <h1>Not signed in</h1>
		   <br />
          <button onClick={handleLogin}>Sign in</button>
        </>
      )}
    </Container>
  );
}

const Container = tw.div`min-h-screen w-full flex items-center justify-center `;
