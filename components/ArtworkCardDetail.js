import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Error from "next/error";
import useSWR from "swr";

import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

const fetcher = async (url) => {
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error("Failed to fetch data");
    }
    return data;
  } catch (error) {
    console.log("This error is in the ArtworkCardDetail file", error);
    return null;
  }
};

export default function ArtworkCardDetail({ objectID }) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList, objectID]);

  async function favouritesClicked() {
    try {
      if (showAdded) {
        await removeFromFavourites(objectID);
      } else {
        await addToFavourites(objectID);
      }
      setFavouritesList(await getFavourites());
      setShowAdded(!showAdded);
    } catch (error) {
      console.error("Error updating favourites:", error);
    }
  }

  const myObjId = parseInt(objectID);

  const { data, error } = useSWR(
    myObjId
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${myObjId}`
      : null,
    fetcher
  );

  if (error) {
    return <Error statusCode={404} />;
  }

  return (
    <Card>
      {data?.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
      <Card.Body>
        <Card.Title>{data?.title || "N/A"}</Card.Title>
        <Card.Text>
          Date: {data?.objectDate || "N/A"} {"\n"}
          Classification: {data?.classification || "N/A"}
          {"\n"}
          Medium: {data?.medium || "N/A"} {"\n"}
          <br />
          <br />
          Artist:
          {data?.artistDisplayName ? (
            <>
              {data.artistDisplayName} (
              <a
                href={data.artistWikidata_URL}
                target="_blank"
                rel="noreferrer">
                wiki
              </a>
              )
            </>
          ) : (
            "N/A"
          )}
          {"\n"}
          Credit Line: {data?.creditLine || "N/A"} {"\n"}
          Dimensions: {data?.dimensions || "N/A"} {"\n"}
          <br />
          <br />
          <Button
            variant={showAdded ? "primary" : "outline-primary"}
            onClick={favouritesClicked}>
            {showAdded ? "+ Favourite (added)" : "+ Favourite"}
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
