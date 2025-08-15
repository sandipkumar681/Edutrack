export const backendCaller = async (route, method = "GET", headers, body) => {
  try {
    const url = `https://edu-track-4phz.onrender.com/api/v1${route}`;

    // const url = `http://10.206.49.192:8087/api/v1${route}`;

    const options = { headers, method };

    if (method !== "GET" && body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        options.body = JSON.stringify(body);
      }
    }

    // console.log(typeof headers, headers);
    // console.log(typeof body, body);
    // console.log(url, method);
    console.log(url);
    const response = await fetch(url, options);

    // console.log(response.json());

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    // console.log("response", response);

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
