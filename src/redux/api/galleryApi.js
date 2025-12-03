import { baseApi } from "./baseApi";

const GallaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGallary: builder.query({
      query: () => ({
        url: `/galleries`,
        method: "GET",
      }),
      providesTags: ["gallary"],
    }),
    addGallary: builder.mutation({
      query: (data) => ({
        url: `/galleries`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["gallary"],
    }),
    deleteGallary: builder.mutation({
      query: (id) => ({
        url: `/galleries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gallary"],
    }),
  }),
});

export const {
  useGetAllGallaryQuery,
  useAddGallaryMutation,
  useDeleteGallaryMutation,
} = GallaryApi;
