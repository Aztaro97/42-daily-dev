import Layout from "@/components/layout";
import PostCard from "@/components/postCard";
import React from "react";
import tw from "twin.macro";

const PodcastPage = () => {
  return (
    <Layout>
      <GridWrapper>
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </GridWrapper>
    </Layout>
  );
};

const GridWrapper = tw.div`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7`


export default PodcastPage;
