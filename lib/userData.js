import { getToken } from "@/lib/authenticate";

async function makeRequest(url, method, body = null) {
  const token = getToken();
  const headers = {
    Authorization: `JWT ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return await response.json();
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function addToFavourites(id) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`;
  return await makeRequest(url, "PUT");
}

export async function removeFromFavourites(id) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`;
  return await makeRequest(url, "DELETE");
}

export async function getFavourites() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/favourites`;
  return await makeRequest(url, "GET");
}

export async function addToHistory(id) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/history/${id}`;
  return await makeRequest(url, "PUT");
}

export async function removeFromHistory(id) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/history/${id}`;
  return await makeRequest(url, "DELETE");
}

export async function getHistory() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/history`;
  return await makeRequest(url, "GET");
}
