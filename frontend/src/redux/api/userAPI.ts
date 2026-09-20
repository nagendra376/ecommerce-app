import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MessageResponse, UserResponse } from "../../types/api-types";
import type { User } from "../../types/types";
import axios from "axios";

// Either read directly:
const server = import.meta.env.VITE_SERVER;

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/user/` }),
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (body) => ({
        url: "new",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const getUser = async (id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${server}/api/v1/user/${id}`,
    );
    return data;
  } catch (error) {
    console.error("Error fetching user from backend:", error);
    return null;
  }
};
export const { useLoginMutation } = userAPI;
