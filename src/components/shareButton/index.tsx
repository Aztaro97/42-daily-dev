import React from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { FaFacebookF, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa"
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share"
import tw from "twin.macro"

const ShareButton = () => {
  const { asPath } = useRouter()

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : ""

  const originUrl = `${origin}${asPath}` as string;
  return (
    <MediaWrapper>
      <MediaText>Share:</MediaText>
      <TwitterShareButton url={originUrl} className="share_btn">
        <FaTwitter size={20} />
      </TwitterShareButton>
      <LinkedinShareButton url={originUrl} className="share_btn">
        <FaLinkedin size={20} />
      </LinkedinShareButton>
      <FacebookShareButton url={originUrl} className="share_btn">
        <FaFacebookF size={20} />
      </FacebookShareButton>
      <WhatsappShareButton url={originUrl} className="share_btn">
        <FaWhatsapp size={20} />
      </WhatsappShareButton>
    </MediaWrapper>
  )
}

const MediaWrapper = styled.div`
  ${tw`flex items-center gap-3`}

  & .share_btn {
    ${tw`hover:scale-125 transition duration-300 ease-in-out`}
  }
`
const MediaText = tw.p`text-base text-white mr-1`

export default ShareButton
