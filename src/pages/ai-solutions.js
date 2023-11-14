import React, { useEffect } from 'react';
import Layout from "../components/layout"

const AISolutionsPage = () => {
  useEffect(() => {
    document.title = "AI Solutions";
  }, []);

  return (
    <Layout>
      <div>
        <h1>AI Solutions</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </div>
    </Layout>
  );
};

export default AISolutionsPage;
