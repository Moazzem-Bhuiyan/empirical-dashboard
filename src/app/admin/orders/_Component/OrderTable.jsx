"use client";

import { Input, Table, Tag, Button, Descriptions } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Search, Eye, Trash } from "lucide-react";
import { useState } from "react";
import OrderDetailsModal from "@/components/SharedModals/OrderDetailsModal";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { useGetOrdersQuery } from "@/redux/api/orderApi";

export default function OrderTable() {
  const [searchText, setSearchText] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedId, setselectedId] = useState(null);
  const [currentpage, setCurrentPage] = useState(1);

  // get order data from api

  const { data, isLoading } = useGetOrdersQuery({
    page: currentpage,
    limit: 10,
    searchText,
  });

  const tableData = data?.data?.map((item) => ({
    id: item._id,
    order_id: item.id,
    customer_name: item.user?.name,
    price: item.amount,
    status: item.status,
    billingDetails: item.billingDetails,
    items: item.items,
    amount: item.amount,
    paymentStatus: item.paymentStatus,
  }));

  // Table columns
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      render: (value) => <span className="text-gray-700">{value}</span>,
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      render: (value) => <span className="text-gray-700">{value}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (value) => <span className="text-gray-700">$ {value}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => {
        let color;
        switch (value) {
          case "pending":
            color = "orange";
            break;
          case "completed":
            color = "green";
            break;
        }
        return (
          <Tag color={color} className="font-medium">
            {value}
          </Tag>
        );
      },
    },

    {
      title: "Action",
      render: (_, record) => (
        <div className="flex items-center gap-x-3">
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                setProfileModalOpen(true);
                setselectedId(record);
              }}
            >
              <Eye color="#1B70A6" size={20} />
            </button>
          </Tooltip>
          <Tooltip title="Show Details">
            <CustomConfirm
              title={"Delete Order Data ?"}
              onConfirm={() => {
                message.success("Order deleted successfully");
              }}
              content={"Are you sure to delte this order?"}
              description={"Are you sure to delte this order?"}
            >
              <button>
                <Trash color="red" size={20} />
              </button>
            </CustomConfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
          colorInfo: "#1B70A6",
        },
      }}
    >
      <div className="mb-4 ml-auto flex w-1/2 gap-x-5">
        <Input
          placeholder="Search by name or product"
          prefix={<Search className="mr-2 text-gray-500" size={20} />}
          className="h-11 rounded-lg border text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div>
        <p className="mb-4 text-sm text-gray-500">Total Orders:</p>
      </div>

      <Table
        style={{ overflowX: "auto" }}
        columns={columns}
        dataSource={tableData}
        scroll={{ x: "100%" }}
        className="rounded-lg shadow-sm"
        rowClassName="hover:bg-gray-50"
        loading={isLoading}
      />

      <OrderDetailsModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
        selectedId={selectedId}
      />
    </ConfigProvider>
  );
}
