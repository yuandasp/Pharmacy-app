import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="flex flex-col gap-9 items-center justify-center h-screen">
      <p className="text-4xl font-bold">Page not found</p>
      <img src="./assets/page-not-found.svg" alt="" width="400px" />
      <Link to={"/"}>
        <p className="text-blue-600">Back to Home</p>
      </Link>
    </div>
  );
}

export default PageNotFound;
