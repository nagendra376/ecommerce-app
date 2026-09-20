import type {  FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { MessageResponse } from "../types/api-types";
import type { SerializedError } from "@reduxjs/toolkit";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast";

type ResType = {
    data: MessageResponse;
} | {
    error: FetchBaseQueryError | SerializedError
}

export function responseToast(
  res: ResType,
  navigate?: NavigateFunction | null,
  url?: string
): void;
export function responseToast(options: {
  res: ResType;
  navigate: NavigateFunction | null;
  url: string;
}): void;
export function responseToast(
  resOrOptions:
    | ResType
    | {
        res: ResType;
        navigate: NavigateFunction | null;
        url: string;
      },
  maybeNavigate?: NavigateFunction | null,
  maybeUrl?: string
) {
  let res: ResType;
  let navigate: NavigateFunction | null | undefined;
  let url: string | undefined;

  if ("res" in resOrOptions) {
    res = resOrOptions.res;
    navigate = resOrOptions.navigate;
    url = resOrOptions.url;
  } else {
    res = resOrOptions;
    navigate = maybeNavigate;
    url = maybeUrl;
  }

  if ("data" in res) {
    toast.success(res.data.message);
    if (navigate && url) navigate(url);
  } else {
    const error = res.error as FetchBaseQueryError;
    const messageResponse = error.data as MessageResponse;
    toast.error(messageResponse?.message || "Something went wrong");
  }
}