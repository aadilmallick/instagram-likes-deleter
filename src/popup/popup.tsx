import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "../styles/globals.css";
import "./popup.css";
import { Button } from "@/components/ui/button";
import Tabs, { TabModel } from "../chrome-api/tabs";

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
      setStatus("Starting deletion process...");

      // Check if we're on the correct page

      // Send message to content script to start deletion
      const tabId = tabModel.tab!.id!;
      await chrome.tabs.sendMessage(tabId, { action: "deleteLikes" });
      setStatus("Deletion process started!");
    } catch (error) {
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
        className="w-full bg-red-600 hover:bg-red-700 text-white"
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
