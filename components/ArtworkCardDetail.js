import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Error from "next/error";
import useSWR from "swr";

import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";

const fetcher = async (url) => {
  try {
    const resp = await fetch(url);
    // console.log(resp);
    const data = await resp.json();
    if (!resp.ok) {
      <Error statusCode={404} />;
      return null;
    } else {
      return data;
    }
  } catch (error) {
    console.log("This error is in the ArtworkCardDetail file", error);
  }
};

export default function ArtworkCardDetail({ objectID }) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(
    favouritesList.includes(objectID) ? true : false
  );
  console.log("This is my fav list", favouritesList);

  function favouritesClicked() {
    if (showAdded) {
      setFavouritesList((current) => current.filter((fav) => fav !== objectID));
    } else {
      setFavouritesList((current) => [...current, objectID]);
    }
    setShowAdded(!showAdded);
  }

  const myObjId = parseInt(objectID);
  // console.log(myObjId);
  // const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${myObjId}`;

  const { data, error } = useSWR(
    myObjId
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${myObjId}`
      : null,
    fetcher
  );
  // console.log(data);
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
              data.artistDisplayName (
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
