import * as React from "react";
import AnthusFooter, {
  defaultBrandLinks,
  defaultCommunityLinks,
  getPlatformLinks,
} from "anthus-footer";
import { StaticImage } from 'gatsby-plugin-image'

const Footer = () => {
  const theme = {
    background: 'var(--color-footer-bg)',
    groupedBackground: 'var(--color-primary-shadow)',
    panelBackground: 'transparent',
    foreground: 'var(--color-inverted-text)',
    mutedForeground: 'var(--color-hamburger)',
    link: 'var(--color-inverted-text)',
    fontFamilyBody: 'var(--font-sans)',
    fontFamilyHeading: 'var(--font-sans)',
    maxWidth: 'var(--max-width)',
  };

  return (
    <AnthusFooter
      className="footer"
      siteId="anthus"
      mode="light"
      productName="Anthus AI Solutions"
      subtitle="Anthus Platform"
      description="We build powerful, AI-native solutions backed by durable procedures, rigorous operational guardrails, and our suite of battle-tested, reusable platform components."
      communityLinks={defaultCommunityLinks}
      brandLinks={defaultBrandLinks}
      platformLinks={getPlatformLinks()}
      byline="Built by Anthus AI Solutions"
      globalSection={false}
      theme={theme}
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
