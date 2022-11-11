const baseUrl = import.meta.env.VITE_APP_API;

const fetchNoToken = async (
  endPoint: string,
  method: string,
  data?: unknown
) => {
  try {
    const url = `${baseUrl}/${endPoint}`;
    const resp = await fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });
    return resp.json();
  } catch (error) {
    console.error(error);
  }
};

const fetchWithToken = async (
  endPoint: string,
  method: string,
  data?: unknown
) => {
  try {
    const url = `${baseUrl}/${endPoint}`;
    const token = localStorage.getItem("token") || "";
    const resp = await fetch(url, {
      method,
      headers: {
        "x-token": token,
      },
      body: data ? JSON.stringify(data) : null,
    });
    return await resp.json();
  } catch (error) {
    console.error(error);
  }
};

export { fetchNoToken, fetchWithToken };
