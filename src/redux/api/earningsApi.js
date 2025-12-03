import { baseApi } from "./baseApi";

const earningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEarnings: builder.query({
      query: ({ page, limit, search }) => ({
        url: `/payments?page=${page}&limit=${limit}&searchTerm=${search}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllEarningsQuery } = earningsApi;
