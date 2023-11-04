import * as React from "react";
import { Link } from "gatsby";
import { StaticImage } from 'gatsby-plugin-image'

const Footer = ({ })=> {

  return (
    <footer>
      <div className="contents">
        <div>
          © {new Date().getFullYear()} Anthus
        </div>
        <div className="logo">
          <StaticImage
            className="logo"
            alt="Anthus?"
            src="../../static/icon.png"
            placeholder="BLURRED"
          />
        </div>
        <div>
          Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </div>
      </div>
    </footer>
  );
  
};

export default Footer;
