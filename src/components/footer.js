import * as React from "react"
import AnthusFooter, {
  defaultCommunityLinks,
  getAnthusLinks,
  getPlatformLinks,
} from "anthus-footer"
import { StaticImage } from "gatsby-plugin-image"

const toLocalPath = href => href?.replace("https://anth.us", "") || href

const brandLinks = getAnthusLinks().map(link => ({
  ...link,
  href: toLocalPath(link.href),
}))

const Footer = () => {
  return (
    <AnthusFooter
      siteId="anthus"
      description="Anthus builds AI-native systems with durable procedures, operational guardrails, and reusable platform components."
      communityLinks={defaultCommunityLinks}
      brandLinks={brandLinks}
      platformLinks={getPlatformLinks()}
      showBottomRow={false}
      localSection={{
        title: "Anthus",
        titleHref: "/",
        titleExternal: false,
      }}
      logo={
        <a href="/" aria-label="Anthus home">
          <StaticImage
            className="logo"
            alt=""
            src="../images/icon.png"
            placeholder="BLURRED"
            width={96}
          />
        </a>
      }
    />
  )
}

export default Footer
