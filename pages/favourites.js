import React from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { Container, Row, Col, Card } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";

export default function Favourites() {
  const [favouritesList] = useAtom(favouritesAtom);
  //console.log("The fav list in the favourites file, ", favouritesList);

  return (
    <Container>
      <Row className="gy-4">
        {favouritesList.length > 0 ? (
          favouritesList.map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))
        ) : (
          <Col>
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>Nothing Here</Card.Title>
                <Card.Text>Try adding some new artwork to the list.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}
