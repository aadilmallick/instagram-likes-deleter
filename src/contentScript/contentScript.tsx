// TODO: content script

import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { css, DOM } from "../utils/Dom";

const CONTENT_SCRIPT_ROOT_ID = "instagram-likes-deleter-root";

const styles = css`
  #${CONTENT_SCRIPT_ROOT_ID} .like-deletion-status {
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

// const stylesTag = DOM.addStyleTag(styles);

const StatusOverlay: React.FC<{ message: string }> = ({ message }) => {
  if (message === "") {
    return null;
  }
  return <div className="like-deletion-status">{message}</div>;
};

const selectorMap = {
  getSelectPostsButton: () => {
    const divs = [...DOM.$$(`div[tabindex="0"][role="button"]:has(> span)`)];
    const selectPostsButton = divs.find(
      (div) => div.textContent?.toLowerCase() === "select"
    );
    return selectPostsButton;
  },
  getUnlikeButton: () => {
    const divs = [
      ...DOM.$$(
        `div[data-bloks-name="bk.components.Flexbox"][role="button"][aria-label="Unlike"][style="pointer-events: auto; width: auto; min-height: 32px; cursor: pointer; -webkit-tap-highlight-color: transparent; align-items: center; justify-content: center;"]:has(span)`
      ),
    ];
    const divButton = divs.find((div) => {
      const span = div.querySelector("span");
      return span?.textContent?.toLowerCase() === "unlike";
    });
    return divButton;
  },
  postsContainerSelector: `div[data-bloks-name="bk.components.Collection"]`,
  postsSelector: `div[aria-label="Image of Post"][tabindex="0"][role="button"]:has(> img)`,
};

const App = () => {
  const [status, setStatus] = React.useState<string>("");

  useEffect(() => {
    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "deleteLikes") {
        deleteLikes();
        sendResponse({ status: "started" });
      }
    });
  }, []);

  const deleteLikes = async () => {
    try {
      setStatus("Starting deletion process...");

      // 1. Click the select posts button
      const selectButton = selectorMap.getSelectPostsButton();
      console.log("selectButton", selectButton);
      if (selectButton) {
        selectButton.click();
      } else {
        throw new Error("Select posts button not found");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Function to find and click the unlike button
      const findAndClickUnlike = async () => {
        let selectedCount = 0;
        const unlikeButtons = Array.from(
          document.querySelectorAll(selectorMap.postsSelector)
        ) as HTMLButtonElement[];
        unlikeButtons.forEach((button) => {
          // Don't click the button if it's already selected
          if (button.dataset["selected"] === "true") {
            return;
          }
          button.click();
          button.dataset["selected"] = "true";
          selectedCount++;
        });
        scrollToLoadMore();
        await delay(ROUND_DELAY);
        return selectedCount;
      };

      const postsContainer = DOM.$throw(selectorMap.postsContainerSelector);
      // // Function to scroll to load more likes

      let deletedCount = 0;
      let currentRoundsWithoutNewLikes = 0;
      const MAX_ROUNDS_WITHOUT_NEW_LIKES = 3;
      const ROUND_DELAY = 3000;

      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const scrollToLoadMore = () => {
        // scroll to the bottom of the posts container
        console.log("scrolling to load more");
        postsContainer.scrollTop += 200;
      };
      let iterations = 1;
      while (currentRoundsWithoutNewLikes < MAX_ROUNDS_WITHOUT_NEW_LIKES) {
        console.log("iteration", iterations);
        const newSelects = await findAndClickUnlike();
        await delay(1000);
        if (newSelects > 0) {
          deletedCount += newSelects;
          setStatus(`Selecting ${deletedCount} posts...`);
          currentRoundsWithoutNewLikes = 0;
        } else {
          currentRoundsWithoutNewLikes++;
          setStatus(
            `Scrolling to load more likes (${currentRoundsWithoutNewLikes}/${MAX_ROUNDS_WITHOUT_NEW_LIKES} attempts)... (${deletedCount} deleted so far)`
          );
        }
        iterations++;
      }
      setStatus(`Finished Selecting. Deleting ${deletedCount} likes...`);
      await delay(2000);

      const unlikeButton = selectorMap.getUnlikeButton();
      console.log("unlikeButton", unlikeButton);
      if (!unlikeButton) {
        throw new Error("Unlike button not found");
      }

      unlikeButton.click();
      // while (!hasReachedBottom()) {
      //   const newSelects = findAndClickUnlike();
      //   if (newSelects > 0) {
      //     deletedCount += newSelects;
      //     setStatus(`Deleted ${deletedCount} likes...`);
      //     // Wait a bit to avoid rate limiting
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
      //   } else {
      //     setStatus(
      //       `Scrolling to load more likes... (${deletedCount} deleted so far)`
      //     );
      //     scrollToLoadMore();
      //     // Wait for content to load
      //     await new Promise((resolve) => setTimeout(resolve, 2000));
      //   }
      // }

      setStatus(`Finished! Deleted ${deletedCount} likes.`);
      setTimeout(() => {
        setStatus("");
      }, 2000);
    } catch (error) {
      setStatus(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    }
  };

  return status ? <StatusOverlay message={status} /> : null;
};

// Create and inject the status overlay container
const container = document.createElement("div");
container.id = CONTENT_SCRIPT_ROOT_ID;
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
