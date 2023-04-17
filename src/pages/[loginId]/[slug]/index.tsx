import Layout from "@/components/layout";
import React from "react";
import tw from "twin.macro";
import {Avatar} from "react-daisyui"
import Image from "next/image";
import Link from "next/link"

const PostPage = () => {
  return (
    <Layout>
		<PostWraper>
			<BannerWrapper>
				<BannerImage
					src="https://daily-now-res.cloudinary.com/image/upload/v1679306271/96835229db75693a44e598609fe73bbb.jpg"
					width={900}
					height={400}
					alt="Post Image"
					/>
				<PostTitle>How to Create Dynamic Routes in Next.js</PostTitle>
				<Box>
					<AuthorLink href="/ataro-ga">
						<Avatar src="https://i.pravatar.cc/300" shape="circle" size="xs" border={true} />
						<span>Mohammed</span>
					</AuthorLink>
					<PostDate>Published: April 13, 2023</PostDate>
				</Box>
			</BannerWrapper>
			<BodyWraper>Post Page</BodyWraper>
		</PostWraper>
    </Layout>
  )
}

const PostWraper = tw.div`max-w-4xl`;
const PostDate = tw.p`text-sm text-gray-400`
const PostTitle = tw.h1`text-4xl text-white mb-4`
const BannerWrapper = tw.div``;
const BannerImage = tw(Image)`w-full h-[400px] object-cover object-center mb-4`;
const BodyWraper = tw.div``;
const AuthorLink = tw(Link)`flex items-center gap-2`;
const Box = tw.div`flex justify-between gap-x-5 mb-4`

export default PostPage;
