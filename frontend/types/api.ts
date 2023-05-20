import type { AxiosResponse } from "axios";

interface ApiResponse extends AxiosResponse {
  data: {
    status: string;
    message: string;
    err: string;
    accessToken: string;
    token: string;

    user: {
      firstName: string;
      lastName: string;
      email: string;
      bio: string;
      gender: string;
      phoneNumber: string;
      college: string;
      birthData: string;
    };
  };
}

export type { ApiResponse };
