import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../styles/globals.css";
import "./popup.css";
import { Button } from "@/components/ui/button";
import Tabs, { TabModel } from "../chrome-api/tabs";
import { deleteLikesChannel } from "../background/controllers/messages";
import { MessagesModel } from "../chrome-api/messages";

const App: React.FC<{}> = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<string>("");

  async function handleCurrentTab() {
    const tab = await Tabs.getCurrentTab();

    if (!tab?.id) {
      return null;
    }

    if (!tab.url?.includes("instagram.com/your_activity/interactions/likes")) {
      Tabs.createTab({
        url: "https://www.instagram.com/your_activity/interactions/likes",
        active: true,
      });
      return null;
    }

    return new TabModel(tab);
  }

  const handleDeleteLikes = async () => {
    try {
      const tabModel = await handleCurrentTab();
      if (!tabModel) return;
      setIsDeleting(true);

      // Send message to content script to start deletion
      const tabId = tabModel.tab!.id!;
      // await chrome.tabs.sendMessage(tabId, { action: "deleteLikes" });
      // const response = await deleteLikesChannel.sendP2CAsyncWithPing(
      //   tabId,
      //   undefined
      // );
      const loaded = await MessagesModel.getContentScriptLoaded(tabId);
      console.log("Loaded", loaded);
      if (!loaded) {
        setStatus("Error: No response from content script.");
        return;
      }

      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000); // to wait for component to mount.
      const response = await deleteLikesChannel.sendP2CAsync(tabId, undefined);
      console.log("Response", response);
      if (!response) {
        setStatus("Error: No response from content script.");
        return;
      }
      switch (response.status) {
        case "error":
          setStatus("An error occurred!");
          break;
        case "started":
          setStatus("Deletion process started!");
          break;
        default:
          setStatus("Unknown status");
          break;
      }
    } catch (error) {
      console.error("Error", error);
      setStatus(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 w-full bg-gray-900 text-white h-full">
      <h1 className="text-xl font-bold mb-4">Instagram Likes Deleter</h1>
      <p className="text-sm mb-4 text-gray-300">
        Navigate to your Instagram likes page and click the button below to
        delete all likes.
      </p>
      <Button
        onClick={handleDeleteLikes}
        disabled={isDeleting}
        className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? "Deleting..." : "Delete All Likes"}
      </Button>
      {status && <p className="mt-4 text-sm text-gray-300">{status}</p>}
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
