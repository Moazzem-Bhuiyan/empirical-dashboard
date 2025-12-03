import React from "react";
import ProductsTable from "./_Component/ProductsTable";
export const metadata = {
  title: "Products",
  description: "Admin products page",
};
export default function page() {
  return (
    <div>
      <ProductsTable />
    </div>
  );
}
