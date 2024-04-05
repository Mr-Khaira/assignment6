import validObjectIDList from "@/public/data/validObjectIDList.json";
import { useRouter } from "next/router";
import ArtworkCard from "@/components/ArtworkCard";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Pagination from "react-bootstrap/Pagination";
import useSWR from "swr";
import { Row, Col } from "react-bootstrap";
import Error from "next/error";

const PER_PAGE = 12;

const fetcher = async (url) => {
  try {
    let res = await fetch(url);
    if (res.ok) {
      let data = await res.json();
      // console.log("Here we are !!!!!!!");
      return data;
    } else {
      return new Error("Problem in fetcger of index.js");
    }
  } catch (error) {
    console.log("Error in the fetcher of artwork/index.js");
    console.log(error);
    return error;
  }
};

// function binaryForID(theIdarr, target) {
//   console.log("The array, ", theIdarr);
//   console.log("The targrt, ", target);
//   let least = 0;
//   let highest = theIdarr.length - 1;

//   while (highest > least) {
//     let mid = Math.floor(least + highest / 2);
//     console.log("mid forever, ", mid);
//     if (target > theIdarr[mid]) {
//       least = mid + 1;
//     } else if (target < theIdarr[mid]) {
//       highest = mid - 1;
//     } else {
//       console.log("The result ", theIdarr[mid]);
//       return theIdarr[mid];
//     }
//   }
//   return undefined;
// }

export default function Index() {
  const [artworkList, setArtworkList] = useState();
  const [page, setPage] = useState(1);

  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1]; //router.asPath: This property of the router object contains the full URL of the current page.
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`;
  const { data, error } = useSWR(url, fetcher);

  // Using state to change page, not the actual value...
  function previousPage() {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  }

  function nextPage() {
    setPage((prevPage) =>
      prevPage < artworkList.length ? prevPage + 1 : prevPage
    );
  }

  useEffect(() => {
    if (data) {
      let filteredResults = validObjectIDList.objectIDs.filter((x) =>
        data.objectIDs?.includes(x)
      );

      // console.log("The data's obj id, ", data?.objectIDs);
      // for (let i = 0; i < data.objectIDs.length; i++) {
      //   let found = binaryForID(validObjectIDList.objectIDs, data.objectIDs[i]);
      //   if (found !== undefined) {
      //     filteredResults.push(found);
      //   }
      // }

      console.log("filteredResults is !!, ", filteredResults);

      let results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }

      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  return (
    <div>
      {error && <Error statusCode={404} />}
      {artworkList && (
        <>
          <Row className="gy-4">
            {artworkList[page - 1]?.map((currentObjectID) => (
              <Col lg={3} key={currentObjectID}>
                <ArtworkCard objectID={currentObjectID} />
              </Col>
            ))}
            {artworkList[page - 1]?.length === 0 && (
              <Card style={{ width: "18rem" }}>
                <h4>Nothing Here</h4>Try searching for something else.
              </Card>
            )}
          </Row>
          {artworkList.length > 0 && (
            <Row>
              <Col>
                <Pagination>
                  <Pagination.Prev onClick={previousPage} />
                  <Pagination.Item>{page}</Pagination.Item>
                  <Pagination.Next onClick={nextPage} />
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
}
