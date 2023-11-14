import React, { useEffect } from 'react';
import Layout from "../components/layout"

const AboutPage = () => {
  useEffect(() => {
    document.title = "About";
  }, []);

  return (
    <Layout>
      <div>
        <h1>About</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </div>
    </Layout>
  );
};

export default AboutPage;
