import Router from "next/router";

const getToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    void Router.push("../");
  }
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (data.status === "true") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
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