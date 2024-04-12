import React from "react";

const Custom404 = () => {
  return (
    <div className="vh-100 flex-center fs-2">
      <span className="text-primary">404</span>
      <span className="mx-5 fs-1">|</span>
      <span>This page could not be found.</span>
    </div>
  );
};

Custom404.getLayout = (page) => <>{page}</>;

export default Custom404;
