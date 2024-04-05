import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Nav,
  Navbar,
  Form,
  Button,
  NavDropdown,
} from "react-bootstrap";
import Link from "next/link";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";

export default function MainNav() {
  const [searchInput, setSearchInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  const url = `/artwork?title=true&q=${searchInput}`;

  const handleLinkClick = () => {
    setIsExpanded(false); // Close the navbar when a link is clicked
  };

  return (
    <Navbar expanded={isExpanded} expand="lg" className="bg-dark navbar-dark">
      <Container>
        <Navbar.Brand>Harkaran Singh Khaira</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setIsExpanded(!isExpanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="/"
              legacybehavior="true"
              passhref="true"
              onClick={handleLinkClick}>
              Home
            </Nav.Link>
            <Nav.Link
              active={router.pathname === "/search"}
              href="/search"
              legacybehavior="true"
              passhref="true"
              onClick={handleLinkClick}>
              Advanced Search
            </Nav.Link>
          </Nav>
          <Form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              let queryString = `title=true&q=${searchInput}`;
              router.push(`/artwork?${queryString}`);
              setSearchHistory((current) => [...current, queryString]);
              setIsExpanded(false);
            }}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <Button type="submit" variant="success">
              Search
            </Button>
          </Form>
          <Nav>
            <NavDropdown title="User Name" id="basic-nav-dropdown">
              <Link
                href="/favourites"
                legacybehavior="true"
                passhref="true"
                onClick={handleLinkClick}>
                <NavDropdown.Item href="/favourites">
                  Favourites
                </NavDropdown.Item>
              </Link>
              <Link
                href="/history"
                legacybehavior="true"
                passhref="true"
                onClick={handleLinkClick}>
                <NavDropdown.Item
                  active={router.pathname === "/history"}
                  href="/history">
                  History
                </NavDropdown.Item>
              </Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
