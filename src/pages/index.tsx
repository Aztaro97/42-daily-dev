import SwitchTheme from "@/components/switchTheme";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import tw from "twin.macro";
import {Button, Progress} from "react-daisyui"
import Layout from "@/components/layout";
import PostCard from "@/components/postCard"

function HomePage() {
  const { data: session, status } = useSession();

  console.log("session", session);
  return (
    <Layout>
		<GridWrapper>
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
			<PostCard />
		</GridWrapper>
    </Layout>
  );
}

const GridWrapper = tw.div`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7`

export default HomePage;
