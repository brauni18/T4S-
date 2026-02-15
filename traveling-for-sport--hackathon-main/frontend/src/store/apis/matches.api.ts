import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Match, MatchWithPosts } from '@/types/match.type';
import { VITE_API_URL } from '@/consts/consts';

export const matchesApi = createApi({
  reducerPath: 'matchesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${VITE_API_URL}/matches` }),
  tagTypes: ['Match'],
  endpoints: (builder) => ({
    getMatches: builder.query<Match[], void>({
      query: () => '/',
      providesTags: ['Match'],
    }),
    getMatchById: builder.query<MatchWithPosts, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Match', id }],
    }),
  }),
});

export const { useGetMatchesQuery, useGetMatchByIdQuery } = matchesApi;