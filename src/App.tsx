import React from "react";
import { LoggedInRouter } from "./routes/logged-in-router";
import { LoggedOutRouter } from "./routes/logged-out-router";

function App() {
  return <LoggedOutRouter />;
}

export default App;
