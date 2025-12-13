const { baseApi } = require("./baseApi");

const OrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/orders?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}`, method: "DELETE" }),
      invalidatesTags: ["order"],
    }),
    updateOrder: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["order"],
    }),
  }),
});
export const {
  useGetOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} = OrderApi;
