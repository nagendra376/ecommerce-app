import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/app.scss";
import App from "./App.tsx";
import { store } from "./redux/store.ts";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <Provider store = {store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>,
);
