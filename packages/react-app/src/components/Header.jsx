import { PageHeader } from "antd";
import {  useThemeSwitcher } from "react-css-theme-switcher";

import lightLogo from './light-logo.png';
import darkLogo from './dark-logo.png';
import React from "react";

// displays a page header

export default function Header({ link, title, subTitle }) {
  const { currentTheme } = useThemeSwitcher();

  return (
  <a href={link} rel="noopener noreferrer">
      <PageHeader title={title} subTitle={subTitle} style={{ cursor: "pointer" }} avatar={
        (currentTheme === "dark") ? {src:lightLogo} : {src:darkLogo} } />
  </a>
  );
}

Header.defaultProps = {
  link: "/",
  title: "NFT Checksum",
  subTitle: "Create and verify NFT from your files",
};
