import Router from "next/router";
import { type ServerResponse } from "types/api";
import axios from "axios";

const getToken = async (): Promise<string | undefined> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    void Router.push("../");
  }
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
  const url:
    | string
    | undefined = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/refresh`;
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
    const { data } = await axios.post<ServerResponse>(
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
    // console.log(data);
    if (data.status === "true") {
      return data.accessToken;
    } else {
      void Router.push("/signin");
    }
  } catch (err) {
    // console.log(err);
    void Router.push("/signin");
  }
};

export default getToken;
