"use client";
import RecentUserTable from "./RecentUserTable";
import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import EarningSummary from "./Earnings";
import RecentOrderTable from "./RecentOrderTable";
import UserStatistics from "./UserStatics";
import { useState } from "react";
import { Spin } from "antd";
import { useGetDashboardDataQuery } from "@/redux/api/dashboardApi";
import AccDetailsTable from "../../account-details/_components/AccDetailsTable";

export default function DashboardContainer() {
  const [earningCurrentYear, setearningCurrentYear] = useState(
    new Date().getFullYear(),
  );
  const [userCurrentYear, setuserCurrentYear] = useState(
    new Date().getFullYear(),
  );
  const {
    data: dashboardMeta,
    isLoading,
    isError,
  } = useGetDashboardDataQuery({
    earningCurrentYear,
    userCurrentYear,
  });
  const stats = dashboardMeta?.data;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading dashboard data.</div>;
  }

  // = Data
  const userStats = [
    {
      key: "users",
      title: "Total Users",

      count: dashboardMeta?.data?.totalUserCount || 0,
    },
    {
      key: "customers",
      title: "Total Order",

      count: dashboardMeta?.data?.totalOrder || 0,
    },
    {
      key: "earning",
      title: "Total Earnings",
      count: dashboardMeta?.data?.totalEarnings || 0,
    },
  ];

  const handleEarningYearChange = (year) => {
    setearningCurrentYear(year);
  };
  const handleUserYearChange = (year) => {
    setuserCurrentYear(year);
  };
  return (
    <div className="space-y-20">
      {/* User Stats Section */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 2xl:grid-cols-3">
        {userStats?.map((stat) => (
          <div
            key={stat.key}
            className="gap-x-4 rounded-2xl border bg-[#FFFFFF] p-5 text-black shadow-sm"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-dmSans text-lg font-medium">{stat.title}</p>
                <h5 className="mt-0.5 text-3xl font-semibold text-black">
                  {stat.key !== "earning" ? (
                    <CustomCountUp end={stat.count} />
                  ) : (
                    <span>
                      $<CustomCountUp end={stat.count} />
                    </span>
                  )}
                </h5>
              </div>
            </div>

            {/* <div className="flex items-center gap-5">
              <h1 className=" text-[#4BB54B] text-xl font-bold flex items-center gap-2 bg-[#4BB54B1A] p-1 mt-2 rounded-lg">
                <span><PiArrowsOutSimple /></span>
                <span>4%</span>
              </h1>
              <h1 className=" text-xl">From the last month</h1>
            </div> */}
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="flex-center-between flex-col gap-10 xl:flex-row">
        <EarningSummary
          earningOverview={stats?.earningOverview}
          onYearChange={handleEarningYearChange}
        />
        <UserStatistics
          userOverview={stats?.userOverview}
          onYearChange={handleUserYearChange}
        />
      </section>

      {/* Recent Users Table */}
      <section>
        <AccDetailsTable limit={5} />
      </section>
    </div>
  );
}
