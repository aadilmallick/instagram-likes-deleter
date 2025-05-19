// TODO: content script

import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { css, DOM } from "../utils/Dom";

const stylesTag = DOM.addStyleTag(css``);

const App = () => {
  return <div></div>;
};

const container = document.createElement("div");
container.id = "my-extension-root";
const root = createRoot(container);
document.body.appendChild(container);
root.render(<App />);
