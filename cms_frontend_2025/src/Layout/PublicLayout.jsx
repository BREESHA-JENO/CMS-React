import React from "react";
import Header from "../Elements/Header";
import Footer from "../Elements/Footer";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PublicLayout;
