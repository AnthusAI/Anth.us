import * as React from "react";
import AnthusFooter, {
  defaultBrandLinks,
  defaultCommunityLinks,
  getPlatformLinks,
} from "anthus-footer";
import { StaticImage } from 'gatsby-plugin-image'

const Footer = () => {
  return (
    <AnthusFooter
      siteId="anthus"
      productName="Anthus AI Solutions"
      subtitle="Anthus Platform"
      description="Anthus builds AI-native systems with durable procedures, operational guardrails, and reusable platform components."
      communityLinks={defaultCommunityLinks}
      brandLinks={defaultBrandLinks}
      platformLinks={getPlatformLinks()}
      byline="Built by Anthus AI Solutions"
      logo={
        <StaticImage
          className="logo"
          alt="Anthus"
          src="../images/icon.png"
          placeholder="BLURRED"
          width={96}
        />
      }
    />
  );
};

export default Footer;
