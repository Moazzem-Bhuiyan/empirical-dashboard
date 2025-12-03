const { baseApi } = require("./baseApi");

const OrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/orders?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}`, method: "DELETE" }),
    }),
    updateOrder: builder.mutation({
      query: (payload) => ({
        url: `/orders/${payload.id}`,
        method: "PUT",
        body: {
          status: payload.status,
        },
      }),
    }),
  }),
});
export const {
  useGetOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} = OrderApi;
