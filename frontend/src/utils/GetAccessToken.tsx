import Router from "next/router";

const getToken = async () => {
  let refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    Router.push("../");
    return false;
  }
  let url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/users/refresh`;
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
      Router.push("../");
    }
  } catch (err) {
    console.log(err);
    Router.push("../");
  }
};

export default getToken;