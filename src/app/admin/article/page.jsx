import React from "react";
import AllArticle from "./_component/AllArticle";
export const metadata = {
  title: "Articles",
  description: "Admin articles page",
};

const page = () => {
  return (
    <div>
      <AllArticle />
    </div>
  );
};

export default page;
