import Router from "next/router";
import { type ApiResponse } from "types/api";
import axios, { type AxiosResponse } from "axios";

const getToken = async (): Promise<string | undefined> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    void Router.push("../");
  }
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
  const url:
    | string
    | undefined = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/users/refresh`;
  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     refreshToken: refreshToken,
    //   }),
    // });
    const response: AxiosResponse<ApiResponse> = await axios.post(
      url,
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data.data;
    if (data.status === "true") {
      return data.accessToken;
    } else {
      void Router.push("../");
    }
  } catch (err) {
    console.log(err);
    void Router.push("../");
  }
};

export default getToken;
