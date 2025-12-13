"use client";

import { Input, Table, Tag, Button, Descriptions, Dropdown, Menu } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Search, Eye, Trash, EllipsisVertical, Filter } from "lucide-react";
import { useState } from "react";
import OrderDetailsModal from "@/components/SharedModals/OrderDetailsModal";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "@/redux/api/orderApi";
import toast from "react-hot-toast";

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
  const [updateOrderStatus] = useUpdateOrderMutation();
  // delete order api
  const [deleteOrder] = useDeleteOrderMutation();
  // Available status options
  const statusOptions = ["processing", "onTheWay", "delivered"];
  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus} successfully`);
    } catch (error) {
      toast.error(
        `Failed to update order status: ${error?.data?.message || error.message}`,
      );
    }
  };
  // Status dropdown menu
  const getStatusMenu = (orderId, currentStatus) => (
    <Menu>
      {statusOptions.map((status) => (
        <Menu.Item
          key={status}
          disabled={status === currentStatus}
          onClick={() => handleStatusChange(orderId, status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Menu.Item>
      ))}
    </Menu>
  );

  // delete order handaler
  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await deleteOrder(orderId).unwrap();
      if (res.success) {
        toast.success("Order deleted successfully!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete order");
    }
  };

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
      filters: [
        {
          text: "Processing",
          value: "processing",
        },
        {
          text: "On The Way",
          value: "onTheWay",
        },
        {
          text: "Delivered",
          value: "delivered",
        },
      ],
      filterIcon: () => (
        <Filter
          size={18}
          color="#000000"
          className="flex items-start justify-start"
        />
      ),
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (value) => {
        let color;
        switch (value) {
          case "processing":
            color = "red";

            break;
          case "onTheWay":
            color = "blue";

            break;
          case "delivered":
            color = "green";

            break;
        }
        return (
          <Tag color={color} className="font-bold uppercase">
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
                handleDeleteOrder(record.id);
              }}
              content={"Are you sure to delte this order?"}
              description={"Are you sure to delte this order?"}
            >
              <button>
                <Trash color="red" size={20} />
              </button>
            </CustomConfirm>
          </Tooltip>
          <Tooltip title="Change status">
            <Dropdown
              overlay={getStatusMenu(record.id, record?.status)}
              trigger={["click"]}
            >
              <button>
                <EllipsisVertical color="#F16365" size={22} />
              </button>
            </Dropdown>
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
