"use client";

import { ConfigProvider, Input, Table, Tag, Tooltip } from "antd";
import { Eye, Search } from "lucide-react";
import { useState, useMemo } from "react";
import EarningModal from "./EarningModal";
import { useGetAllEarningsQuery } from "@/redux/api/earningsApi";

export default function EarningsTable() {
  const [showEarningModal, setShowEarningModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const {
    data: earningData,
    isLoading,
    refetch,
  } = useGetAllEarningsQuery({
    page: currentPage,
    limit: 10,
    search: searchText,
  });

  // Map API response to table data
  const tableData = useMemo(() => {
    if (!earningData?.data) return [];
    return earningData.data.map((item, index) => ({
      key: item.id || item._id,
      userName: item.user?.name,
      userEmail: item.user?.email,
      order: item.order,
      transactionId: item.transactionId,
      amount: item.amount,
      status: item.status,
      isPaid: item.isPaid,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    }));
  }, [earningData]);

  // Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      render: (value) => `#${value}`,
    },
    {
      title: "User Name",
      dataIndex: "userName",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
    },
    {
      title: "Order ID",
      dataIndex: "order",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => (
        <Tag color="blue" className="!text-base font-semibold">
          ${value}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <Tag color={record.isPaid ? "green" : "red"}>
          {record.status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Purchase Date",
      dataIndex: "createdAt",
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
      {/* Search */}
      <div className="mb-3 ml-auto w-1/3 gap-x-5">
        <Input
          placeholder="Search by name, email or transaction ID"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Earnings Table */}
      <section className="my-10">
        <Table
          loading={isLoading}
          style={{ overflowX: "auto" }}
          columns={columns}
          dataSource={tableData}
          scroll={{ x: "max-content" }}
          pagination={{
            current: currentPage,
            pageSize: earningData?.meta?.limit || 10,
            total: earningData?.meta?.total || 0,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </section>

      {/* Earning Modal */}
      <EarningModal open={showEarningModal} setOpen={setShowEarningModal} />
    </ConfigProvider>
  );
}
