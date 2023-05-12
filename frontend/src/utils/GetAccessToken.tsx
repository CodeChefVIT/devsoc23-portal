import Router from "next/router";

const getToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    void Router.push("../");
    return false;
  }
  const url: string|undefined = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/users/refresh`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });
    const data = await response.json();
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
