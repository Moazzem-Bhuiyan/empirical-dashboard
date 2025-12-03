"use client";

import { Input, Table } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Search } from "lucide-react";
import { Eye } from "lucide-react";
import { UserX } from "lucide-react";
import { useState } from "react";
import { Filter } from "lucide-react";
import Image from "next/image";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import ProfileModal from "@/components/SharedModals/ProfileModal";
import {
  useBlockUnblockUserMutation,
  useGetAllusersQuery,
} from "@/redux/api/userApi";
import moment from "moment";
import toast from "react-hot-toast";

export default function AccDetailsTable({ limit }) {
  const [searchText, setSearchText] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  // User data with query parameterss
  const { data, isLoading } = useGetAllusersQuery({
    limit: limit || 10,
    page: currentPage,
    searchText,
  });

  // Dummy table Data
  const dataSource = data?.data?.userList?.map((user, inx) => ({
    key: inx + 1,
    name: user?.name,
    id: user?._id,
    userImg: user?.photoUrl,
    email: user?.email,
    contact: user?.contractNumber || "N/A",
    date: moment(user?.createdAt).format("ll"),
    status: user?.status || "Active",
  }));

  // status change api handaler----------------

  const [updateStatus, { isLoading: updating }] = useBlockUnblockUserMutation();

  const handleBlockUser = async (values) => {
    console.log(values);
    const payload = {
      userId: values.id,
      status: values?.status == "active" ? "blocked" : "active",
    };
    try {
      const res = await updateStatus(payload).unwrap();
      if (res.success) {
        toast.success(
          `${values.name} ${values?.status == "blocked" ? "unblocked" : "Blcoked"} successfully!`,
        );
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // ================== Table Columns ================
  const columns = [
    {
      title: "Serial",
      dataIndex: "key",
      render: (value) => `#${value}`,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (value, record) => {
        // Helper function to validate URL
        const isValidUrl = (url) => {
          if (!url) return false;
          return (
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("/")
          );
        };

        // Get the first letter of the name (uppercase)
        const firstLetter = value ? value.charAt(0).toUpperCase() : "";

        // Determine if the image is valid
        const hasValidImage = isValidUrl(record?.photo);

        return (
          <div className="flex-center-start gap-x-2">
            {hasValidImage ? (
              <Image
                src={record?.userImg}
                alt="User avatar"
                width={40}
                height={40}
                className="aspect-square h-auto w-10 rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5b400] text-lg font-medium text-white">
                {firstLetter}
              </div>
            )}
            <p className="font-medium">{value}</p>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Contact",
      dataIndex: "contact",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",

      filters: [
        {
          text: "Customer",
          value: "Customer",
        },
        {
          text: "Service Provider",
          value: "serviceProvider",
        },
      ],
      filterIcon: () => (
        <Filter
          size={18}
          color="#fff"
          className="flex items-start justify-start"
        />
      ),
      onFilter: (value, record) => record.accountType.indexOf(value) === 0,
      render: (value) => (
        <span
          className={`rounded-full border border-gray-300 px-3 py-1 font-semibold ${
            value === "active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {value === "active" ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="flex-center-start gap-x-3">
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                setProfileModalOpen(true);
                setSelectedUser(record);
              }}
            >
              <Eye color="#1B70A6" size={22} />
            </button>
          </Tooltip>

          <Tooltip title="Block User">
            <CustomConfirm
              title={`${record?.status == "blocked" ? "Unblock User" : "Blocked User"}`}
              description={`Are you sure to ${record?.status == "blocked" ? "Unblock" : "blocked"} this user?`}
              loading={updating}
              onConfirm={() => handleBlockUser(record)}
            >
              <button>
                <UserX color="#F16365" size={22} />
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
      <div className="mb-3 ml-auto w-1/3 gap-x-5">
        <Input
          placeholder="Search by name or email"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        style={{ overflowX: "auto" }}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "100%" }}
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: data?.meta?.total,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `Total ${total} users`,
        }}
      ></Table>

      <ProfileModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
        selectedUser={selectedUser}
      />
    </ConfigProvider>
  );
}
