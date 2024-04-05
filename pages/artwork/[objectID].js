import React from "react";
import { Row, Col } from "react-bootstrap";
import ArtworkCardDetail from "@/components/ArtworkCardDetail";
import { useRouter } from "next/router";

export default function ObjectID() {
  const router = useRouter();
  const currObjId = router.query;
  // console.log("the object which contains the object id is", currObjId);
  return (
    <>
      <Row>
        <Col>
          <ArtworkCardDetail objectID={currObjId.objectID} />
        </Col>
      </Row>
    </>
  );
}
