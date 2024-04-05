import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import Error from "next/error";
import useSWR from "swr";

const fetcher = async (url) => {
  //console.log("Hi this is me");
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error("Failed to fetch");
    }
    return await resp.json();
  } catch (error) {
    console.log("Error fetching data:", error);
    throw error;
  }
};

export default function ArtworkCard({ objectID }) {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;

  const { data, error } = useSWR(url, fetcher);

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src={
          data.primaryImageSmall ||
          "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"
        }
      />
      <Card.Body>
        <Card.Title>{data.title || "N/A"}</Card.Title>
        <Card.Text>
          Date: {data.objectDate || "N/A"} <br />
          Classification: {data.classification || "N/A"} <br />
          Medium: {data.medium || "N/A"} <br />
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passhref="true">
          <Button variant="primary">{objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
