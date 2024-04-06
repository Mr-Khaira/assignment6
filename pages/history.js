import React from "react";
import { searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { Button, Card, ListGroup } from "react-bootstrap";
import styles from "@/styles/History.module.css";
import { removeFromHistory } from "@/lib/userData"; // Importing removeFromHistory function

export default function History() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  let parsedHistory = [];

  // Convert searchHistory strings to parsed objects
  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  // Function to handle history item click
  async function historyClicked(e, index) {
    e.preventDefault();
    router.push(`/artwork?searchHistory[${index}]`);
  }

  // Function to remove history item
  async function removeHistoryClicked(e, index) {
    e.stopPropagation(); // stop the event from triggering other events
    setSearchHistory(await removeFromHistory(searchHistory[index])); // Update the atom value
  }

  if (!searchHistory) return null; // Check if search history is not yet loaded

  return (
    <div>
      {parsedHistory.length === 0 ? (
        // Render a message if search history is empty
        <Card>
          <Card.Body>
            <p>Nothing Here. Try searching for some artwork.</p>
          </Card.Body>
        </Card>
      ) : (
        // Render search history list if not empty
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              className={styles.historyListItem} // Apply CSS module class
              onClick={(e) => historyClicked(e, index)} // Handle click event
            >
              {/* Render each property of the history item */}
              {Object.keys(historyItem).map((key) => (
                <span key={key}>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </span>
              ))}
              {/* Button to remove history item */}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => removeHistoryClicked(e, index)} // Handle remove click event
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
