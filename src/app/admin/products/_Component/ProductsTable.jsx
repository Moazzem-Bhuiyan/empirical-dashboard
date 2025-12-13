"use client";
import { Button, Input, Table } from "antd";
import { Tooltip, ConfigProvider, message } from "antd";
import { Edit, PlusCircle, Search, Trash } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import AddproductModal from "@/components/SharedModals/AddproductModal";
import EditProductModal from "./EditProductModal";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/redux/api/productApi";
import toast from "react-hot-toast";

export default function ProductsTable() {
  const [searchText, setSearchText] = useState("");
  const [addProductModalOpen, setShowCreateCategoryModal] = useState(false);
  const [editProductModalOpen, seteditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { data: products, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 10,
  });

  // delete api
  const [deleteProduct] = useDeleteProductMutation();

  const data = products?.data?.map((item, index) => ({
    key: index + 1,
    _id: item?._id,
    id: item?.id,
    product: item?.title,
    userImg: item?.images[0],
    images: item?.images,
    price: `${item?.price}`,
    stock: item?.stock,
    category: item?.category || "N/A",
    description: item?.description,
    status: item?.status,
    size: item?.size || [],
    discountPrice: item?.discountPrice || 0,
  }));

  const columns = [
    {
      title: "Product ID",
      dataIndex: "id",
    },
    {
      title: "Product Name",
      dataIndex: "product",
    },
    {
      title: "Image",
      dataIndex: "userImg",
      render: (value) => (
        <Image
          src={value}
          alt="product"
          width={50}
          height={50}
          className="rounded-md"
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      render: (value) => <span>{value} pcs</span>,
    },

    {
      title: "Action",
      render: (_, record) => (
        <div className="flex gap-3">
          <Tooltip title="Edit Product">
            <button
              onClick={() => {
                setSelectedProduct(record);
                seteditProductModalOpen(true);
              }}
            >
              <Edit color="#1B70A6" size={20} />
            </button>
          </Tooltip>

          <Tooltip title="Delete Product">
            <CustomConfirm
              title="Delete Product"
              description="Are you sure to delete this product?"
              onConfirm={handleDeleteProduct(record?._id)}
            >
              <button>
                <Trash color="#F16365" size={20} />
              </button>
            </CustomConfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  // delete product handler
  const handleDeleteProduct = (id) => async () => {
    try {
      const res = await deleteProduct(id).unwrap();
      if (res.success) {
        toast.success("Product deleted successfully!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
        },
      }}
    >
      <div className="mb-3 ml-auto flex w-1/2 gap-4">
        <Input
          placeholder="Search by Product Name"
          prefix={<Search className="mr-2 text-black" size={18} />}
          className="h-11 !rounded-lg !border"
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Button
          type="primary"
          icon={<PlusCircle size={18} />}
          className="flex items-center"
          style={{ backgroundColor: "#BE9955" }}
          onClick={() => setShowCreateCategoryModal(true)}
        >
          Add Product
        </Button>
      </div>

      <Table columns={columns} dataSource={data} loading={isLoading} />

      <AddproductModal
        open={addProductModalOpen}
        setOpen={setShowCreateCategoryModal}
      />
      <EditProductModal
        open={editProductModalOpen}
        setOpen={seteditProductModalOpen}
        product={selectedProduct}
      />
    </ConfigProvider>
  );
}
