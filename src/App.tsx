import React from "react";
import { useRoutes } from "react-router-dom";

import { Footer } from "./components/Footer/Footer";
import Header from "./components/Header";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { router } from "./router";

function App() {
  const element = useRoutes(router);

  return (
    <>
      <ScrollToTop />
      <Header />
      <Layout>{element}</Layout>
      <Footer />
    </>
  );
}

export default App;
