import * as React from "react";
import { StaticImage } from 'gatsby-plugin-image'

const moreLinks = [
  { text: "Join us on Discord", url: "https://discord.gg/f2TtbVx5" },
  { text: "Connect on LinkedIn", url: "https://www.linkedin.com/in/ryanalynporter/" },
  { text: "Follow us on GitHub", url: "https://github.com/Anth-us" }
]

const utmParameters = `?utm_source=anthus&utm_medium=footer`

const Footer = () => {

  return (
    <footer>
      <div className="fullWidth">
        <div className="links">
          {moreLinks.map((link, i) => (
            <React.Fragment key={link.url}>
              <a href={`${link.url}${utmParameters}`}>{link.text}</a>
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
