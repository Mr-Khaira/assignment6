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
import { isAuthenticatedAtom, searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { removeToken } from "@/lib/authenticate"; // Import removeToken function

export default function MainNav() {
  const [searchInput, setSearchInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom); // Access isAuthenticatedAtom
  const router = useRouter();

  const url = `/artwork?title=true&q=${searchInput}`;

  const handleLinkClick = () => {
    setIsExpanded(false); // Close the navbar when a link is clicked
  };

  const submitForm = async (e) => {
    e.preventDefault();
    let queryString = `title=true&q=${searchInput}`;
    router.push(`/artwork?${queryString}`);
    setSearchHistory(await addToHistory(queryString));
    setIsExpanded(false);
  };

  // Function to handle logout
  const logout = () => {
    setIsExpanded(false); // Close the navbar
    removeToken(); // Remove token from local storage
    router.push("/login"); // Redirect to login page
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
            {isAuthenticated && ( // Render Advanced Search link if authenticated
              <Nav.Link
                active={router.pathname === "/search"}
                href="/search"
                legacybehavior="true"
                passhref="true"
                onClick={handleLinkClick}>
                Advanced Search
              </Nav.Link>
            )}
          </Nav>
          {isAuthenticated && ( // Render search form if authenticated
            <Form className="d-flex" onSubmit={submitForm}>
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
          )}
          <Nav>
            {isAuthenticated ? ( // Render user dropdown if authenticated
              <NavDropdown title="User Name" id="basic-nav-dropdown">
                <NavDropdown.Item href="/favourites">
                  Favourites
                </NavDropdown.Item>
                <NavDropdown.Item href="/history">History</NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>
                  Logout
                </NavDropdown.Item>{" "}
                {/* Logout option */}
              </NavDropdown>
            ) : (
              <Nav>
                {/* Render Register and Login links if not authenticated */}

                <Nav.Link
                  href="/register"
                  passHref
                  onClick={() => setIsExpanded(false)}>
                  Register
                </Nav.Link>

                <Nav.Link
                  href="/login"
                  passHref
                  onClick={() => setIsExpanded(false)}>
                  Login
                </Nav.Link>
              </Nav>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
