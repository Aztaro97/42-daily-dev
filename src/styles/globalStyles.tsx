import React from "react";
import { Global, css } from "@emotion/react";
import tw, { theme, GlobalStyles as BaseStyles } from "twin.macro";

const customStyles = css({
  body: {
    ...tw`antialiased`,
    WebkitTapHighlightColor: theme`colors.purple.500`,
    fontFamily: [" --roboto-font", "serif"],
    // background: theme`colors.secondary`,
  },
});

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
);

export default GlobalStyles;
