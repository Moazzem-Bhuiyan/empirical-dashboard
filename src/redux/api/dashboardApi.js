import { baseApi } from "./baseApi";

const dashBoardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: ({ earningcurrentYear, usercurrentYear }) => ({
        url: `/meta?earning_year=${earningcurrentYear}&user_year=${usercurrentYear}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashBoardApi;
