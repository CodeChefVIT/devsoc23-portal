import type { AxiosResponse } from "axios";

interface ApiResponse extends AxiosResponse {
  data: {
    status: string;
    message: string;
    err: string;
  };
}

export type { ApiResponse };
