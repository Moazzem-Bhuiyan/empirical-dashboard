import { baseApi } from "./baseApi";

const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllusers: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/users?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getUserById: builder.query({
      query: (id) => ({ url: `/teachers/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "user", id }],
    }),
    blockUnblockUser: builder.mutation({
      query: (data) => ({
        url: `/users/change-status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["user"],
    }),

    // ======================company related api=================================

    addcompany: builder.mutation({
      query: (data) => ({
        url: "/users/add-company",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllusersQuery,
  useBlockUnblockUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useAddcompanyMutation,
} = UserApi;
