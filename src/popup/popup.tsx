import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../styles/globals.css";
import "./popup.css";
import { Button } from "@/components/ui/button";

const App: React.FC<{}> = () => {
  return (
    <div>
      <p className="text-white text-2xl underline font-black">Hello world</p>
      <Button variant="outline" className="bg-white text-black">
        Hello
      </Button>
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
