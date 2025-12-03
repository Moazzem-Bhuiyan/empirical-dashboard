const { baseApi } = require("./baseApi");

const ArticleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ page, limit, search }) => ({
        url: `/articles?page=${page}&limit=${limit}&searchTerm=${search}`,
        method: "GET",
      }),
      providesTags: ["article"],
    }),
    addArticle: builder.mutation({
      query: (data) => ({
        url: "/articles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["article"],
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["article"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useAddArticleMutation,
  useDeleteArticleMutation,
} = ArticleApi;
