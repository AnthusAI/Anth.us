import * as React from "react";
import { StaticImage } from 'gatsby-plugin-image'

const moreLinks = [
  { text: "Contact us", url: "https://docs.google.com/forms/d/e/1FAIpQLSdWlt4KpwPSBHzg3o8fikHcfrzxo5rCcV-0-zDt815NZ1tcyg/viewform?usp=sf_link"}
  { text: "Follow us on GitHub", url: "https://github.com/Anth-us" },
  { text: "Connect on LinkedIn", url: "https://www.linkedin.com/in/ryanalynporter/" },
  { text: "Join us on Discord", url: "https://discord.gg/uStyWraJ2M" }
]

const Footer = () => {

  return (
    <footer>
      <div className="fullWidth">
        <div className="links">
          {moreLinks.map((link, i) => (
            <React.Fragment key={link.url}>
              <a href={`${link.url}`}>{link.text}</a>
              {i !== moreLinks.length - 1 && <> · </>}
            </React.Fragment>
          ))}
        </div>
        
        <div className="contents">
          <div className="logo">
            <StaticImage
              className="logo"
              alt="Anthus?"
              src="../images/icon.png"
              placeholder="BLURRED"
            />
          </div>
        </div>
      </div>
    </footer>
  );
  
};

export default Footer;
