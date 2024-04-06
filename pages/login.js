// login.js

import { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import { authenticateUser } from "@/lib/authenticate";
import { useAtom } from "jotai"; // Import useAtom
import { getFavourites, getHistory } from "@/lib/userData"; // Import getFavourites and getHistory
import { favouritesAtom, searchHistoryAtom } from "@/store"; // Import favouritesAtom and searchHistoryAtom from store.js

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom); // Destructure setFavouritesList from favouritesAtom
  const [, setSearchHistory] = useAtom(searchHistoryAtom); // Destructure setSearchHistory from searchHistoryAtom

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await authenticateUser(user, password);
      await updateAtoms(); // Invoke updateAtoms
      router.push("/favourites");
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <Card bg="light">
        <Card.Body>
          <h2>Login</h2>
          Enter your login information below:
        </Card.Body>
      </Card>
      <br />
      {warning && (
        <>
          <Alert variant="danger">{warning}</Alert>
          <br />
        </>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label>
          <Form.Control
            type="text"
            value={user}
            id="userName"
            name="userName"
            onChange={(e) => setUser(e.target.value)}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <br />
        <Button variant="primary" className="pull-right" type="submit">
          Login
        </Button>
      </Form>
    </>
  );
}
